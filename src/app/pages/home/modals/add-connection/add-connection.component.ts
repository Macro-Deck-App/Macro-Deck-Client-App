import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { Connection } from '../../../../datatypes/connection';
import { QuickSetupQrCodeData } from '../../../../datatypes/quick-setup-qr-code-data';
import { ScanNetworkInterfacesComponent } from '../scan-network-interfaces/scan-network-interfaces.component';
import { DiagnosticService } from '../../../../services/diagnostic/diagnostic.service';
import { Subscription } from 'rxjs';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { ConnectionFailedComponent } from '../connection-failed/connection-failed.component';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-add-connection-modal',
  templateUrl: './add-connection.component.html',
  styleUrls: ['./add-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule, FormsModule, NgTemplateOutlet, QrCodeScannerComponent],
})
export class AddConnectionComponent implements OnInit, OnDestroy {
  editConnection: boolean = false;
  quickSetupQrCodeData: QuickSetupQrCodeData | undefined;
  id: string = '';
  name: string | undefined;
  host: string = '';
  port: number = 8191;
  useSsl: boolean = false;
  autoConnect: boolean = false;
  index: number = 0;
  page: string = 'quick-setup';
  subscription: Subscription = new Subscription();

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private diagnosticService: DiagnosticService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit() {
    if (this.diagnosticService.isiOSorAndroid() && !this.editConnection) {
      this.subscription.add(
        QrCodeScannerComponent.quickSetupQrCodeScanned.subscribe(
          async (qrCodeScanner) => {
            const dataBase64 = qrCodeScanner.split('quick-setup/').pop();
            if (dataBase64) {
              const dataJson = atob(dataBase64);
              this.quickSetupQrCodeData = JSON.parse(
                dataJson,
              ) as QuickSetupQrCodeData;
              await this.handleQuickSetupQrCode();
            }
          },
        ),
      );
      await this.handleQuickSetupQrCode();
    }
  }

  async handleQuickSetupQrCode() {
    if (!this.quickSetupQrCodeData) {
      return;
    }

    this.name = this.quickSetupQrCodeData.instanceName;
    this.port = this.quickSetupQrCodeData.port;
    this.useSsl = this.quickSetupQrCodeData.ssl;

    const modal = await this.modalController.create({
      component: ScanNetworkInterfacesComponent,
      componentProps: {
        quickSetupQrCodeData: this.quickSetupQrCodeData,
      },
      presentingElement: await this.modalController.getTop(),
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      this.host = data;
      const alert = await this.alertController.create({
        subHeader: `Network interface ${data} was selected!`,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
      return;
    }

    if (role === 'no-network-interfaces') {
      const modal = await this.modalController.create({
        component: ConnectionFailedComponent,
        componentProps: {
          name: this.quickSetupQrCodeData.instanceName,
          errorInformation: `Tried interfaces: ${this.quickSetupQrCodeData.networkInterfaces.join(', ')}\nPort: ${this.quickSetupQrCodeData.port}\nSSL: ${this.quickSetupQrCodeData.ssl ? 'Yes' : 'No'}`,
        },
        presentingElement: await this.modalController.getTop(),
      });
      await modal.present();
      await modal.onDidDismiss();
      this.reset();
    }
  }

  async cancel() {
    await this.modalController.dismiss(null, 'cancel');
  }

  async confirm() {
    if (!(await this.validate())) {
      return;
    }

    let connection: Connection = {
      host: this.host,
      id: this.id,
      name:
        this.name === undefined || this.name.length === 0
          ? this.host
          : this.name,
      port: this.port,
      ssl: this.useSsl,
      index: this.index,
      autoConnect: this.autoConnect,
      usbConnection: false,
      token:
        this.quickSetupQrCodeData?.token !== undefined &&
        this.quickSetupQrCodeData.token.length > 0
          ? this.quickSetupQrCodeData.token
          : undefined,
    };

    await this.modalController.dismiss(connection, 'confirm');
  }

  async validate(): Promise<boolean> {
    if (this.host === undefined || this.host.length === 0) {
      await this.showErrorAlert('The IP Address / Hostname is required.');
      return false;
    } else if (this.port === undefined || this.port === null) {
      await this.showErrorAlert('The port is required.');
      return false;
    }

    return true;
  }

  async showErrorAlert(text: string) {
    const alert = await this.alertController.create({
      subHeader: text,
      buttons: [
        {
          text: 'Ok',
        },
      ],
    });

    await alert.present();
  }

  reset() {
    this.quickSetupQrCodeData = undefined;
    this.host = '';
    this.port = 8191;
    this.useSsl = false;
    this.name = '';
    this.autoConnect = false;
  }
}
