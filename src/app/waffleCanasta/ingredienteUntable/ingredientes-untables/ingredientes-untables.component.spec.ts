import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientesUntablesWaffleCanastaComponent } from './ingredientes-untables.component';
import { of, throwError } from 'rxjs';
import { AlertDialogService } from 'src/app/alert-dialog.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { WaffleCanastaService } from 'src/app/services/waffle-canasta.service';

describe('IngredientesUntablesWaffleCanastaComponent', () => {
  let component: IngredientesUntablesWaffleCanastaComponent;
  let fixture: ComponentFixture<IngredientesUntablesWaffleCanastaComponent>;
  let alertService: jasmine.SpyObj<AlertDialogService>;
  let waffleCanastaService: jasmine.SpyObj<WaffleCanastaService>;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockIngredientes = [{ ingrediente_com: 'Vainilla',inventario: '1', id: '2'},{ ingrediente_com: 'Fresa', inventario: '2', id: '4'} ];
  let ingredinetesMock = {
    getIngredientesU: jasmine.createSpy('getIngredientesU').and.returnValue(of(mockIngredientes)),
    deleteIngredienteU: jasmine.createSpy('deleteIngredienteU').and.returnValue(of()),
  }
  let AuthServicMock = {
    lang: jasmine.createSpy('lang').and.returnValue('en'),
  }
  beforeEach(async () => {
    alertService = jasmine.createSpyObj('AlertService', ['mostrarAlerta']);
    waffleCanastaService = jasmine.createSpyObj('WaffleCanastaService', ['getIngredientesU', 'deleteIngredienteU']);
    await TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientTestingModule ],
      declarations: [ IngredientesUntablesWaffleCanastaComponent, TranslatePipe ],
      providers: [
        { provide: AlertDialogService, useValue: alertService },
        { provide: Router, useValue: mockRouter },
        { provide: WaffleCanastaService, useValue: ingredinetesMock },
        { provide: AuthService, useValue: AuthServicMock}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientesUntablesWaffleCanastaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the drinks', async () => {
    ingredinetesMock.getIngredientesU.and.returnValue(of(mockIngredientes))
    component.ngOnInit()
    await fixture.whenStable();
    expect(component.ingredientes).toEqual(mockIngredientes)
  });

  it('debería mostrar una alerta y navegar hasta el administrador cuando se produzca un error de caducidad del token', async () => {
    AuthServicMock.lang.and.returnValue('es')
    ingredinetesMock.getIngredientesU.and.returnValue(throwError({ error: { message: 'Token expired' } }));
  
    component.ngOnInit();
    await fixture.whenStable();
  
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Tu sesión ha expirado, inicia sesión nuevamente');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
  });

  it('should show alert and navigate to admin when token expired error occurs', async () => {
    AuthServicMock.lang.and.returnValue('en')
    ingredinetesMock.getIngredientesU.and.returnValue(throwError({ error: { message: 'Token expired' } }));
  
    component.ngOnInit();
    await fixture.whenStable();
  
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Your session has expired, please log in again');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
  });


  it('should return an object without the object with the id that was deleted', async () => {
    component.ingredientes = mockIngredientes
    ingredinetesMock.deleteIngredienteU.and.returnValue(of())
    const remIndex = mockIngredientes.findIndex(i => i.id === '4')
    mockIngredientes.splice(remIndex)
    ingredinetesMock.getIngredientesU.and.returnValue(of(mockIngredientes))
    const mockBebidasRem = [{ harina: 'Vainilla',inventario: '1', id: '2' }];
    component.deleteIngrediente(4)
    await fixture.whenStable();
    setTimeout(() =>{
      expect(component.ingredientes).toEqual(mockBebidasRem)
    }, 400)
    
  });

  it('should return an object without the object with the id that was deleted (error token expired)', async () => {
    AuthServicMock.lang.and.returnValue('en')
    ingredinetesMock.deleteIngredienteU.and.returnValue(throwError({ error: { message: 'Token expired' } }));
    component.deleteIngrediente(4)
    await fixture.whenStable();
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Your session has expired, please log in again');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
  });

  it('should return an object without the object with the id that was deleted (error token expired, in return new snows)', async () => {
    AuthServicMock.lang.and.returnValue('en')
    ingredinetesMock.deleteIngredienteU.and.returnValue(of())
    ingredinetesMock.getIngredientesU.and.returnValue(throwError({ error: { message: 'Token expired' } }));
    const remIndex = mockIngredientes.findIndex(i => i.id === '4')
    mockIngredientes.splice(remIndex)
    
    const mockBebidasRem = [{ harina: 'Vainilla',inventario: '1', id: '2' }];
    component.deleteIngrediente(4)
    await fixture.whenStable();
    setTimeout(()=> {
      expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Your session has expired, please log in again');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
  
    }, 200)
  });

  it('should navigate to create', () => {
    component.navigateCreate()
    expect(mockRouter.navigate).toHaveBeenCalledWith(['createWafflesCanastaIngredienteUntable']);
  });

  it('should navigate to edit', () => {
    component.navigateEdit(2)
    expect(mockRouter.navigate).toHaveBeenCalledWith(['editWafflesCanastaIngredienteUntable', 2]);
  });
});
