import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertDialogService } from 'src/app/alert-dialog.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { WaffleCanastaService } from 'src/app/services/waffle-canasta.service';

@Component({
  selector: 'app-create-form-nives',
  templateUrl: './create-form-nives.component.html',
  styleUrls: ['./create-form-nives.component.css']
})
export class CreateFormNivesWaffleCanastaComponent {
  nieve: any= {
    nieve: '',
    inventario: ''
  }
  constructor(private service: WaffleCanastaService, private router: Router, private alertService: AlertDialogService, private authService: AuthService){}
  saveNewNieve(){
    if(this.nieve.nieve == '' && this.nieve.inventario == ''){
      if(this.authService.lang() === 'es'){
        this.alertService.mostrarAlerta('Por favor ingresa todos los datos');
      }else if(this.authService.lang() === 'en'){
        this.alertService.mostrarAlerta('Please enter all the data');
      }
    }else if(this.nieve.nieve == '' && this.nieve.inventario !== ''){
      if(this.authService.lang() === 'es'){
        this.alertService.mostrarAlerta('Por favor ingresa el nombre de la nieve');
      }else if(this.authService.lang() === 'en'){
        this.alertService.mostrarAlerta('Please enter the name of the snow');
      }
    }else if(this.nieve.inventario == '' && this.nieve.nieve !== ''){
      if(this.authService.lang() === 'es'){
        this.alertService.mostrarAlerta('Por favor ingresa un inventario');
      }else if(this.authService.lang() === 'en'){
        this.alertService.mostrarAlerta('Please enter an inventory');
      }
    }else{
    this.service.saveNieve(this.nieve).subscribe(
      res =>{
        if(this.authService.lang() === 'es'){
          this.alertService.mostrarAlerta('Nieve creada correctamente');
          }else if(this.authService.lang() === 'en'){
            this.alertService.mostrarAlerta('Ice cream created correctly');
          }
        this.router.navigate(['/wafflesCanastaNieve']);
      },
      err => {
              if(err.error.message === 'Token expired'){
                if(this.authService.lang() === 'es'){
                  this.alertService.mostrarAlerta('Tu sesión ha expirado, inicia sesión nuevamente');
                  }else if(this.authService.lang() === 'en'){
                    this.alertService.mostrarAlerta('Your session has expired, please log in again');
                  }
                this.router.navigate(['admin']);
              }
              }
    )}
  }
}
