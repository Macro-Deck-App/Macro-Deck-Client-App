import {ChangeDetectionStrategy, Component, EventEmitter} from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-qr-code-scanner-ui',
  templateUrl: './qr-code-scanner-ui.component.html',
  styleUrls: ['./qr-code-scanner-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class QrCodeScannerUiComponent {

  public static backTapped: EventEmitter<any> = new EventEmitter();

  constructor() { }

  back() {
    QrCodeScannerUiComponent.backTapped.emit();
  }
}
