import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Configuracao } from './configuracao';

describe('Configuracao', () => {
  let component: Configuracao;
  let fixture: ComponentFixture<Configuracao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Configuracao],
    }).compileComponents();

    fixture = TestBed.createComponent(Configuracao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
