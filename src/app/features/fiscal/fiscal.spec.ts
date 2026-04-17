import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fiscal } from './fiscal';

describe('Fiscal', () => {
  let component: Fiscal;
  let fixture: ComponentFixture<Fiscal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fiscal],
    }).compileComponents();

    fixture = TestBed.createComponent(Fiscal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
