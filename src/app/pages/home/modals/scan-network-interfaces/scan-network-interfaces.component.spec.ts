import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanNetworkInterfacesComponent } from './scan-network-interfaces.component';

describe('ScanNetworkInterfacesComponent', () => {
  let component: ScanNetworkInterfacesComponent;
  let fixture: ComponentFixture<ScanNetworkInterfacesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanNetworkInterfacesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanNetworkInterfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
