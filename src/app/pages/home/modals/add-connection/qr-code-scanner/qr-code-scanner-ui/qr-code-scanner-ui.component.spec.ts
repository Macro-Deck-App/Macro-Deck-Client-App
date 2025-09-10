import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QrCodeScannerUiComponent } from './qr-code-scanner-ui.component';

describe('QrCodeScannerUiComponent', () => {
  let component: QrCodeScannerUiComponent;
  let fixture: ComponentFixture<QrCodeScannerUiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), QrCodeScannerUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeScannerUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
