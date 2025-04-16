import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WidgetContentComponent } from './widget-content.component';

describe('WidgetContentComponent', () => {
  let component: WidgetContentComponent;
  let fixture: ComponentFixture<WidgetContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), WidgetContentComponent]
}).compileComponents();

    fixture = TestBed.createComponent(WidgetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
