import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrepaSaladaAderesoComponent } from './crepa-salada-adereso.component';
import { of, throwError } from 'rxjs';
import { AlertDialogService } from 'src/app/alert-dialog.service';
import { CrepaDulceService } from 'src/app/services/crepa-dulce.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from 'src/app/translate/translate.pipe';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { CrepaSaladaService } from 'src/app/services/crepa-salada.service';

describe('CrepaSaladaAderesoComponent', () => {
  let component: CrepaSaladaAderesoComponent;
  let fixture: ComponentFixture<CrepaSaladaAderesoComponent>;
  let alertService: jasmine.SpyObj<AlertDialogService>;
  let crepaDulceService: jasmine.SpyObj<CrepaDulceService>;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockadereso = [{ adereso: 'Vainilla',inventario: '1', id: '2'},{ adereso: 'Fresa', inventario: '2', id: '4'} ];
  let AderesoMock = {
    getAderesos: jasmine.createSpy('getAderesos').and.returnValue(of(mockadereso)),
    deleteAdereso: jasmine.createSpy('deleteAdereso').and.returnValue(of()),
  }
  let AuthServicMock = {
    lang: jasmine.createSpy('lang').and.returnValue('en'),
  }
  beforeEach(async () => {
    alertService = jasmine.createSpyObj('AlertService', ['mostrarAlerta']);
    crepaDulceService = jasmine.createSpyObj('CrepaDulceService', ['getAderesos', 'deleteAdereso']);
    await TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientTestingModule ],
      declarations: [ CrepaSaladaAderesoComponent, TranslatePipe ],
      providers: [
        { provide: AlertDialogService, useValue: alertService },
        { provide: Router, useValue: mockRouter },
        { provide: CrepaSaladaService, useValue: AderesoMock },
        { provide: AuthService, useValue: AuthServicMock}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrepaSaladaAderesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the drinks', async () => {
    AderesoMock.getAderesos.and.returnValue(of(mockadereso))
    component.ngOnInit()
    await fixture.whenStable();
    expect(component.aderesos).toEqual(mockadereso)
  });

  it('debería mostrar una alerta y navegar hasta el administrador cuando se produzca un error de caducidad del token', async () => {
    AuthServicMock.lang.and.returnValue('es')
    AderesoMock.getAderesos.and.returnValue(throwError({ error: { message: 'Token expired' } }));
  
    component.ngOnInit();
    await fixture.whenStable();
  
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Tu sesión ha expirado, inicia sesión nuevamente');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
  });

  it('should show alert and navigate to admin when token expired error occurs', async () => {
    AuthServicMock.lang.and.returnValue('en')
    AderesoMock.getAderesos.and.returnValue(throwError({ error: { message: 'Token expired' } }));
  
    component.ngOnInit();
    await fixture.whenStable();
  
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Your session has expired, please log in again');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
  });


  it('should return an object without the object with the id that was deleted', async () => {
    component.aderesos = mockadereso
    AderesoMock.deleteAdereso.and.returnValue(of())
    const remIndex = mockadereso.findIndex(i => i.id === '4')
    mockadereso.splice(remIndex)
    AderesoMock.getAderesos.and.returnValue(of(mockadereso))
    const mockBebidasRem = [{ adereso: 'Vainilla',inventario: '1', id: '2' }];
    component.deleteAdereso(4)
    await fixture.whenStable();
    setTimeout(() =>{
      expect(component.aderesos).toEqual(mockBebidasRem)
    }, 400)
    
  });

  it('should return an object without the object with the id that was deleted (error token expired)', async () => {
    AuthServicMock.lang.and.returnValue('en')
    AderesoMock.deleteAdereso.and.returnValue(throwError({ error: { message: 'Token expired' } }));
    component.deleteAdereso(4)
    await fixture.whenStable();
    expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Your session has expired, please log in again');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
  });

  it('should return an object without the object with the id that was deleted (error token expired, in return new snows)', async () => {
    AuthServicMock.lang.and.returnValue('en')
    AderesoMock.deleteAdereso.and.returnValue(of())
    AderesoMock.getAderesos.and.returnValue(throwError({ error: { message: 'Token expired' } }));
    const remIndex = mockadereso.findIndex(i => i.id === '4')
    mockadereso.splice(remIndex)
    
    const mockBebidasRem = [{ adereso: 'Vainilla',inventario: '1', id: '2' }];
    await component.deleteAdereso(4)
    await fixture.whenStable();
    setTimeout(()=> {
      expect(alertService.mostrarAlerta).toHaveBeenCalledWith('Your session has expired, please log in again');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['admin']);
  
    }, 200)
  });

  it('should navigate to create', () => {
    component.navigateCreate()
    expect(mockRouter.navigate).toHaveBeenCalledWith(['createCrepaSaladaAdereso']);
  });

  it('should navigate to edit', () => {
    component.navigateEdit(2)
    expect(mockRouter.navigate).toHaveBeenCalledWith(['editCrepaSaladaAdereso', 2]);
  });
});
