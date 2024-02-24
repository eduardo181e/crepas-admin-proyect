import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertDialogService } from 'src/app/alert-dialog.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { IdService } from 'src/app/services/id.service';
import { CrepaSaladaSalesGlobalService } from 'src/app/services/salesGlobal/crepa-salada-sales.service';
@Component({
  selector: 'app-crepa-salada-adereso-base-ventas',
  templateUrl: './crepa-salada-adereso-base-ventas.component.html',
  styleUrls: ['./crepa-salada-adereso-base-ventas.component.css']
})
export class CrepaSaladaAderesoBaseVentasGlobalesComponent {
  sucursal_id:any = this.idService.getId();
  adereso1:any = {
    sucursal_id: this.sucursal_id,
    fecha: new Date()
  }
  aderesos: any = [];
  fecha:any = {
    fecha1: '',
    fecha2: ''
  }
  constructor(private service: CrepaSaladaSalesGlobalService, private idService: IdService,private alert: AlertDialogService,private router: Router, private authService: AuthService) {}

  formatDate(date: Date): string {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
  
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  } 
  ngOnInit(): void {
    this.adereso1.fecha = this.formatDate(this.adereso1.fecha);


    this.service.getAderesosBase(this.adereso1).subscribe(
      (res:any) => {console.log(res)
        res.forEach((element:any , index:any) => {
          const fecha = element.created_at;
          // Separa la fecha en partes
const año = fecha.substr(0, 4);
const mes = fecha.substr(5, 2);
const dia = fecha.substr(8, 2);
const hora = fecha.substr(11, 2);
const minuto = fecha.substr(14, 2);
const segundo = fecha.substr(17, 2);

// Construye la fecha legible
const fechaFormateada = `${dia}/${mes}/${año} a las ${hora}:${minuto}:${segundo}`;
res[index].created_at = fechaFormateada;
        })
        this.aderesos = res
      console.log(this.sucursal_id)},
      err => {
        if(this.authService.lang() === 'es'){
          this.alert.mostrarAlerta('Tu sesión ha expirado, inicia sesión nuevamente');
          }else if(this.authService.lang() === 'en'){
            this.alert.mostrarAlerta('Your session has expired, please log in again');
          }
      }
    
    )
  }

  genarar(){
    if(this.fecha.fecha1 === '' || this.fecha.fecha2 === ''){
      this.alert.mostrarAlerta('Selecciona las fechas');
  }else{
    const año = this.fecha.fecha1.substr(0, 4);
    const mes = this.fecha.fecha1.substr(5, 2);
    const dia = this.fecha.fecha1.substr(8, 2);
    const fecha1 = `${año}-${mes}-${dia}`
    const año1 = this.fecha.fecha2.substr(0, 4);
    const mes1 = this.fecha.fecha2.substr(5, 2);
    const dia1 = this.fecha.fecha2.substr(8, 2);
    const fecha2 = `${año1}-${mes1}-${dia1}`
    const fecha = {
      fecha1: fecha1,
      fecha2: fecha2
    }

    this.adereso1.fechaInicio = fecha.fecha1;
    this.adereso1.fechaFin = fecha.fecha2;
    this.service.lapsSalesAderesoBase(this.adereso1).subscribe(
      (res:any) => {console.log(res)
        res.forEach((element:any , index:any) => {
          const fecha = element.created_at;
          // Separa la fecha en partes
const año = fecha.substr(0, 4);
const mes = fecha.substr(5, 2);
const dia = fecha.substr(8, 2);
const hora = fecha.substr(11, 2);
const minuto = fecha.substr(14, 2);
const segundo = fecha.substr(17, 2);

// Construye la fecha legible
const fechaFormateada = `${dia}/${mes}/${año} a las ${hora}:${minuto}:${segundo}`;
res[index].created_at = fechaFormateada;
        })
        this.aderesos = res
      },
      err => {
        if(this.authService.lang() === 'es'){
          this.alert.mostrarAlerta('Tu sesión ha expirado, inicia sesión nuevamente');
          }else if(this.authService.lang() === 'en'){
            this.alert.mostrarAlerta('Your session has expired, please log in again');
          }
      }
    );



    console.log(fecha)
  }
  }

  viewFactura(id:any){
    this.router.navigate(['/viewFactura/'+ id]);
  }

  facturas1(){
    if(this.aderesos.length === 0){
      return false;
    }else{
      return true;
    }
  }
}
