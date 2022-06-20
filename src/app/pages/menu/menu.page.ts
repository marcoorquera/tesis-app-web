import { Component, OnInit } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';

import { AlertController, NavController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { UrlSegment } from '@angular/router';
import { getAuth, deleteUser, signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth";
import { CrudPostulantesService } from 'src/app/services/crud-postulantes.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})


export class MenuPage implements OnInit {
  nombre_admin: string;
  apellido_admin: string;
  img_admin: string;
  email: string;
 
  // usuario={
  //   correo:'',
  //   contrasena:''

  // }

  correos
  user = [];
  constructor(
    private afs: AngularFireDatabase,private crudPostulantes: CrudPostulantesService,
    private afAuth: AngularFireAuth,private navCtrl: NavController,
    private navCtr: NavController,private alertCtroller: AlertController,
    private authservice: AuthService) { }

  ngOnInit() {
    const auth=getAuth()
    onAuthStateChanged(auth,user => {
    console.log(user)
    if (user) {

      this.getemails().subscribe(res=>{
          this.correos = res;
      })

      this.showProfile(user.uid)
    }
    else {
      this.navCtr.navigateBack('/inicio');
    }
  
  

    
  })
     
     
  }
  // onSubmitTemplate(){
  //   console.log('bdshfbdh')}
  // }
  showProfile(uid) {
    this.afs.list('admin/' + uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_admin = this.user[5];
      this.apellido_admin = this.user[0];
      this.img_admin = this.user[4];
      console.log("this.user")
      console.log(this.user)
    })
  }

  goToProfile() {
    this.navCtr.navigateForward('/administrador')
  }

  goToVendedor() {
    this.navCtr.navigateForward('/vendedor')
  }
  goToVendedores() {
    this.navCtr.navigateForward('/lista-vendedores')
  }

solicitud
 async goToSolicitudes() {

    // this.crudPostulantes.getPostulantes().subscribe(postulante =>{
    //   this.solicitud = postulante;
      
    //   console.log("postulantes: "+this.solicitud.length)
    //   if (this.solicitud.length!=0){
    //     console.log("estoy dentro")
        this.navCtr.navigateForward('/postulantes')
        
        //this.navCtrl.navigateForward("/menu")
        
    //   }else{
        
    //     let heade='Postulantes'
    //     let message='No se encontró ningun postulante'
    //      this.searchPostulante(heade,message)
    //   }
    // })
    
   
    
  }

  async searchPostulante(header:string,message:string){
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'exit',
      header: header,
      message: message,
      buttons: ['OK']

    })
    await alert.present();
  }
  goToCategoria() {
    this.navCtr.navigateForward('/categorias')
  }

  
  logout() {
    this.afAuth.signOut()
   


    
        console.log("filtro: "+this.correos)
        this.correos.map(p => {
         

          const auth = getAuth();
          signInWithEmailAndPassword(auth, p.email, p.password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;


              deleteUser(user).then(() => {
                console.log("eliminado ", p.email, p.password)
                this.afs.object("emails/" + p.uid).remove()
                // User deleted.
              }).catch((error) => {
                // An error ocurred
                // ...
              });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });


        })

      
   
    //this.navCtr.navigateBack('/inicio')
  }

  newAdmin() {
    this.navCtr.navigateForward("nuevo-admin")
  }

  getemails(){
    return this.afs.list('/emails').valueChanges();
    
  }


}
