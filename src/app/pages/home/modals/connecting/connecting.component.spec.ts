import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectingComponent } from './connecting.component';

describe('ConnectingComponent', () => {
  let component: ConnectingComponent;
  let fixture: ComponentFixture<ConnectingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ConnectingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
