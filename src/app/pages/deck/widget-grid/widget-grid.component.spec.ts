import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WidgetGridComponent } from './widget-grid.component';

describe('WidgetGridComponent', () => {
  let component: WidgetGridComponent;
  let fixture: ComponentFixture<WidgetGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), WidgetGridComponent]
}).compileComponents();

    fixture = TestBed.createComponent(WidgetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
