import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientesBaseCreateFormComponent } from './ingredientes-base-create-form.component';
import { AlertDialogService } from 'src/app/alert-dialog.service';
import { of, throwError } from 'rxjs';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrepaSaladaService } from 'src/app/services/crepa-salada.service';

describe('IngredientesBaseCreateFormComponent', () => {
  let component: IngredientesBaseCreateFormComponent;
  let fixture: ComponentFixture<IngredientesBaseCreateFormComponent>;
  let alertService: jasmine.SpyObj<AlertDialogService>;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  let IngredientesServiceMock = {
    saveIngredienteB: jasmine.createSpy('saveIngredienteB').and.returnValue(of([{ingrediente_base: 'vainilla', inventario: '1', id: 1, tipo: 'Otros'}])),
  }
  let AuthServicMock = {
    lang: jasmine.createSpy('lang').and.returnValue('en'),
  }
  beforeEach(async () => {
    alertService = jasmine.createSpyObj('AlertService', ['mostrarAlerta']);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule],
      declarations: [ IngredientesBaseCreateFormComponent, TranslatePipe ],
      providers: [ 
        
        { provide: AlertDialogService, useValue: alertService },
        { provide: Router, useValue: mockRouter },
        { provide: CrepaSaladaService, useValue: IngredientesServiceMock},
        { provide: AuthService, useValue: AuthServicMock},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientesBaseCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask for all the data', () => {
    AuthServicMock.lang.and.returnValue('en')
    component.ingrediente.ingrediente_base = ''
    component.ingrediente.inventario = ''
    component.saveNewIngrediente();
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Please enter all the data');
  });


  it('should order the ingrediente', () => {
    AuthServicMock.lang.and.returnValue('en')
    component.ingrediente.ingrediente_base = ''
    component.ingrediente.inventario = '1'
    component.saveNewIngrediente();
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Please enter the name of the ingredient');
  });

  it('should order the inventory', () => {
    AuthServicMock.lang.and.returnValue('en')
    component.ingrediente.ingrediente_base = 'Vainilla'
    component.ingrediente.inventario = ''
    component.saveNewIngrediente();
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Please enter an inventory');
  });


  it('should send the data correctly', () => {
    AuthServicMock.lang.and.returnValue('en')
    component.ingrediente.ingrediente_base = 'Vainilla'
    component.ingrediente.inventario = '1'
    const bebida = {
      ingrediente_base: 'Vainilla',
      inventario: '1'
    }
    component.saveNewIngrediente()
    expect(IngredientesServiceMock.saveIngredienteB).toHaveBeenCalledWith(bebida)
    IngredientesServiceMock.saveIngredienteB.and.returnValue(throwError({ error: { message: 'Token expired' } }))
    setTimeout(() => {
      expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Your session has expired, please log in again');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
    }, 400)
  });

// Español
  it('should ask for all the data (es)', () => {
    AuthServicMock.lang.and.returnValue('es')
    component.ingrediente.ingrediente_base = ''
    component.ingrediente.inventario = ''
    component.saveNewIngrediente();
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Por favor ingresa todos los datos');
  });


  it('should order the ingrediente (es)', () => {
    AuthServicMock.lang.and.returnValue('es')
    component.ingrediente.ingrediente_base = ''
    component.ingrediente.inventario = '1'
    component.saveNewIngrediente();
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Por favor ingresa el nombre de el ingrediente');
  });

  it('should order the inventory (es)', () => {
    AuthServicMock.lang.and.returnValue('es')
    component.ingrediente.ingrediente_base = 'Vainilla'
    component.ingrediente.inventario = ''
    component.saveNewIngrediente();
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Por favor ingresa un inventario');
  });


  it('should send the data correctly (es)', () => {
    AuthServicMock.lang.and.returnValue('es')
    component.ingrediente.ingrediente_base = 'Vainilla'
    component.ingrediente.inventario = '1'
    const bebida = {
      ingrediente_base: 'Vainilla',
      inventario: '1',
    }
    component.saveNewIngrediente()
    expect(IngredientesServiceMock.saveIngredienteB).toHaveBeenCalledWith( bebida)
    IngredientesServiceMock.saveIngredienteB.and.returnValue(of())
    setTimeout(() => {
      expect(alertService.mostrarAlerta).toHaveBeenCalledWith('ingrediente guardada correctamente');
    }, 400)
    
  });

  it('should send the data correctly (es) error', () => {
    AuthServicMock.lang.and.returnValue('es')
    component.ingrediente.ingrediente_base = 'Vainilla'
    component.ingrediente.inventario = '1'
    const bebida = {
      ingrediente_base: 'Vainilla',
      inventario: '1'
    }
    component.saveNewIngrediente()
    expect(IngredientesServiceMock.saveIngredienteB).toHaveBeenCalledWith( bebida)
    IngredientesServiceMock.saveIngredienteB.and.returnValue(throwError({ error: { message: 'Token expired' } }))
    setTimeout(() => {
      expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Tu sesión ha expirado, inicia sesión nuevamente');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
    }, 400)
    
  });
});
