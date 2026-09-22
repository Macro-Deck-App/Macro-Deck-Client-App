import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeckPage } from './deck.page';

describe('DeckPage', () => {
  let component: DeckPage;
  let fixture: ComponentFixture<DeckPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DeckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
