import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { QuickSetupQrCodeData } from '../../../../datatypes/quick-setup-qr-code-data';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-scan-network-interfaces',
  templateUrl: './scan-network-interfaces.component.html',
  styleUrls: ['./scan-network-interfaces.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule],
})
export class ScanNetworkInterfacesComponent implements AfterViewInit {
  quickSetupQrCodeData: QuickSetupQrCodeData | undefined;

  scanning: boolean = false;
  port: number = 8191;
  networkInterfaces: string[] = [];
  networkInterfacesAvailable: string[] = [];
  networkInterfacesUnavailable: string[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
  ) {}

  public ngAfterViewInit() {
    setTimeout(async () => {
      await this.testConnections();
    });
  }

  private async testConnections() {
    if (!this.quickSetupQrCodeData) return;

    this.scanning = true;

    const { ssl, port, networkInterfaces } = this.quickSetupQrCodeData;
    this.port = port;
    this.networkInterfaces = networkInterfaces;

    const checkPromises = networkInterfaces.map(async (networkInterface) => {
      const url = `${ssl ? 'https' : 'http'}://${networkInterface}:${port}/ping`;

      try {
        const response = await firstValueFrom(
          this.http.get(url).pipe(
            takeUntilDestroyed(this.destroyRef),
            timeout(3000),
            catchError(() => of(null)),
          ),
        );

        return { networkInterface, available: response !== null };
      } catch {
        return { networkInterface, available: false };
      }
    });

    const results = await Promise.all(checkPromises);

    this.networkInterfacesAvailable = results
      .filter((result) => result.available)
      .map((result) => result.networkInterface);

    this.networkInterfacesUnavailable = results
      .filter((result) => !result.available)
      .map((result) => result.networkInterface);

    this.scanning = false;

    if (this.networkInterfacesAvailable.length === 0) {
      await this.modalController.dismiss(null, 'no-network-interfaces');
    } else if (this.networkInterfacesAvailable.length === 1) {
      await this.modalController.dismiss(
        this.networkInterfacesAvailable[0],
        'confirm',
      );
    }
  }

  async applyInterface(networkInterface: string) {
    await this.modalController.dismiss(networkInterface, 'confirm');
  }
}
