import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyComponent } from './buy.component';

describe('BuyComponent', () => {
  let component: BuyComponent;
  let fixture: ComponentFixture<BuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.buyComponent(BuyComponentt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should buy', () => {
    expect(component).toBeTruthy();
  });
});