import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InsecureConnectionComponent } from './insecure-connection.component';

describe('InsecureConnectionComponent', () => {
  let component: InsecureConnectionComponent;
  let fixture: ComponentFixture<InsecureConnectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), InsecureConnectionComponent]
}).compileComponents();

    fixture = TestBed.createComponent(InsecureConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
