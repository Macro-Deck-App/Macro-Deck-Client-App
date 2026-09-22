import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WebHomePage } from './web-home.page';

describe('WebHomePage', () => {
  let component: WebHomePage;
  let fixture: ComponentFixture<WebHomePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WebHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
