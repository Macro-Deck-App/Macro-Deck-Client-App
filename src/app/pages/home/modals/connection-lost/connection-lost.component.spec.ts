import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionLostComponent } from './connection-lost.component';

describe('ConnectionLostComponent', () => {
  let component: ConnectionLostComponent;
  let fixture: ComponentFixture<ConnectionLostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ConnectionLostComponent]
}).compileComponents();

    fixture = TestBed.createComponent(ConnectionLostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
