import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConnectionLostPage } from './connection-lost.page';

describe('ConnectionLostPage', () => {
  let component: ConnectionLostPage;
  let fixture: ComponentFixture<ConnectionLostPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ConnectionLostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
