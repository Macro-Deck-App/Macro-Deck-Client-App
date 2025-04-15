import { Component, OnInit } from '@angular/core';
import {QuickSetupQrCodeData} from "../../../../datatypes/quick-setup-qr-code-data";
import {HttpClient} from "@angular/common/http";
import {catchError, of, timeout} from "rxjs";
import {IonicModule, ModalController} from "@ionic/angular";


@Component({
  selector: 'app-scan-network-interfaces',
  templateUrl: './scan-network-interfaces.component.html',
  styleUrls: ['./scan-network-interfaces.component.scss'],
  imports: [
    IonicModule
]
})
export class ScanNetworkInterfacesComponent  implements OnInit {

  quickSetupQrCodeData: QuickSetupQrCodeData | undefined;

  scanning: boolean = false;
  port: number = 8191;
  networkInterfaces: string[] = [];
  networkInterfacesAvailable: string[] = [];
  networkInterfacesUnavailable: string[] = [];

  constructor(private http: HttpClient,
              private modalController: ModalController) { }

  async ngOnInit() {
    await this.testConnections();
  }

  private async testConnections() {
    if (this.quickSetupQrCodeData === undefined) {
      return;
    }

    this.scanning = true;

    const ssl = this.quickSetupQrCodeData.ssl;
    this.port = this.quickSetupQrCodeData.port;
    this.networkInterfaces = this.quickSetupQrCodeData.networkInterfaces;

    for (const networkInterface of this.networkInterfaces) {
      const url = `${ssl ? "https" : "http"}://${networkInterface}:${this.port}/ping`;
      this.http.get(url).pipe(
        timeout(3000),
        catchError(error => {
          return of(null);
        })).subscribe(async response => {
          if (response !== null) {
            this.networkInterfacesAvailable.push(networkInterface);
          } else {
            this.networkInterfacesUnavailable.push(networkInterface);
          }

          if (this.networkInterfacesAvailable.length + this.networkInterfacesUnavailable.length == this.networkInterfaces.length) {
            this.scanning = false;

            if (this.networkInterfacesAvailable.length === 0) {
              await this.modalController.dismiss(null, 'no-network-interfaces');
              return;
            }

            if (this.networkInterfacesAvailable.length === 1) {
              const networkInterface = this.networkInterfacesAvailable[0];
              await this.modalController.dismiss(networkInterface, 'confirm');
            }
          }
      });
    }
  }

  async applyInterface(networkInterface: string) {
    await this.modalController.dismiss(networkInterface, 'confirm');
  }
}
