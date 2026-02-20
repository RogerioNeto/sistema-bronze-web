import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreReserva } from './pre-reserva';

describe('PreReserva', () => {
  let component: PreReserva;
  let fixture: ComponentFixture<PreReserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreReserva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreReserva);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
