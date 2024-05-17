import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPontoComponent } from './cadastrar-ponto.component';

describe('CadastrarPontoComponent', () => {
  let component: CadastrarPontoComponent;
  let fixture: ComponentFixture<CadastrarPontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrarPontoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarPontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
