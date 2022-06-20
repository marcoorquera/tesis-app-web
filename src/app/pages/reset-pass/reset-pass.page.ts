import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {
  email_recover: string;
  constructor(private authservice: AuthService,
    private navCtrl: NavController,
    ) { }

  ngOnInit() {
  }

  sendLinkReset(){
    if(this.email_recover != ""){
      
      this.authservice.resetPassword(this.email_recover).then((res) => {
        console.log('enviado',res)
        alert('Revise su correo para continuar con el proceso')
      }).catch((err)=>{
        console.log('error',err)
        alert('ingrese un correo válido')
      })
    }else{
     
      alert('Ingrese su correo electrónico')
    }
  }

  goToLogin(){
    this.navCtrl.navigateBack('/login');

  }
}
