import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {AlertController, IonicModule, ModalController} from "@ionic/angular";
import {BarcodeScanner, SupportedFormat} from "@capacitor-community/barcode-scanner";
import {Subscription} from "rxjs";
import {QrCodeScannerUiComponent} from "./qr-code-scanner-ui/qr-code-scanner-ui.component";

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class QrCodeScannerComponent implements OnInit, OnDestroy {

  public static quickSetupQrCodeScanned: EventEmitter<string> = new EventEmitter();

  private subscription: Subscription = new Subscription();

  constructor(private alertController: AlertController) {
  }

  async ngOnInit() {
    this.subscription.add(QrCodeScannerUiComponent.backTapped.subscribe(async () => {
      await this.stopScan();
    }));
  }

  async ngOnDestroy() {
    await this.stopScan();
    this.subscription.unsubscribe();
  }

  async stopScan() {
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    await BarcodeScanner.stopScan();
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      await this.presentAlert();
      return;
    }

    await BarcodeScanner.prepare({targetedFormats: [SupportedFormat.QR_CODE]});

    document.querySelector('body')?.classList.add('barcode-scanner-active');

    await BarcodeScanner.startScanning({targetedFormats: [SupportedFormat.QR_CODE]}, async result => {
      if (result.hasContent && result.content.toLowerCase().startsWith("https://macro-deck.app/quick-setup")) {
        await this.stopScan();
        QrCodeScannerComponent.quickSetupQrCodeScanned.emit(result.content);
      }
    });
  }

  async requestPermissions(): Promise<boolean> {
    const camera = await BarcodeScanner.checkPermission({force: true});
    return camera.granted === true;
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
