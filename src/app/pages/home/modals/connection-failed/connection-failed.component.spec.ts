import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionFailedComponent } from './connection-failed.component';

describe('ConnectionFailedComponent', () => {
  let component: ConnectionFailedComponent;
  let fixture: ComponentFixture<ConnectionFailedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ConnectionFailedComponent]
}).compileComponents();

    fixture = TestBed.createComponent(ConnectionFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
