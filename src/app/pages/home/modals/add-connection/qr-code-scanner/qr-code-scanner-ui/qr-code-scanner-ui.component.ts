import {Component, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-qr-code-scanner-ui',
  templateUrl: './qr-code-scanner-ui.component.html',
  styleUrls: ['./qr-code-scanner-ui.component.scss'],
})
export class QrCodeScannerUiComponent {

  public static backTapped: EventEmitter<any> = new EventEmitter();

  constructor() { }

  back() {
    QrCodeScannerUiComponent.backTapped.emit();
  }
}
