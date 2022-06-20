import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/compat/database';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { getAuth, deleteUser,onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, child, get } from "firebase/database";
import { CrudPostulantesService } from 'src/app/services/crud-postulantes.service';
@Component({
  selector: 'app-postulantes',
  templateUrl: './postulantes.page.html',
  styleUrls: ['./postulantes.page.scss'],
})
export class PostulantesPage implements OnInit {
  user =[];
  nombre_admin: string;
  apellido_admin: string;
  email_admin: string;
  tlfono_admin: number;

  idSelected: any;
  show: boolean;

  Collection: AngularFireList<any>;
  solicitudes= [];

  postulante = {uid: null, nombre: null, apellido:null, direccion: null, email: null, fecha_nacimiento: null, telefono: null, imagen: null, nombre_empresa: null}

  constructor(
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private authservice: AuthService,
    private alertCtroller: AlertController,  
    private crudPostulantes: CrudPostulantesService,private toastCtrl: ToastController
    
  ) { }

  ngOnInit() {
    const auth=getAuth()

    const user = auth.currentUser;
   
      if(user){
        this.show=false;
        this.showProfile(user.uid)
        this.getPostulantes()
      }else{
        this.navCtrl.navigateBack('/inicio');
      }       
    
  }
  showProfile(uid){
    this.afs.list('admin/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_admin = this.user[3];
      this.apellido_admin = this.user[0];
      this.email_admin = this.user[1];
      this.tlfono_admin = this.user[4];
      console.log('nombre: '+this.nombre_admin)
      console.log('apellido: '+this.apellido_admin)
    })
  }
  header:string;
  message:string;
  getPostulantes(){
   
        this.crudPostulantes.getPostulantes().subscribe(postulante =>{
                 this.solicitudes = postulante;
                 if(this.solicitudes.length===0){
                  console.log("No hat data");
                  let heade='Postulantes'
                  let message='No se encontró ningun postulante'
                   this.presentToast(message)


                 }
    
        })
        
      
  }

  async presentToast(m) {
    let toast = await this.toastCtrl.create({
      message: m,
      duration: 1000,
      position: 'middle'
    });
  
    
  
    toast.present();
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
  /*
  selecFruit(id){
    this.show=true;
    this.idSelected = id;

    let receivedPostulantes: any;

    this.crudPostulantes.getPostulante(id).subscribe(postulante=>{
      receivedPostulantes = postulante;
      this.postulante = receivedPostulantes;
      
    })
    
  }
  */
  pushPostulante(id, nombre, apellido,telefono, direccion, nombre_empresa, fecha_nacimiento, image, email,password){
    console.log("estoy dentro  del push")
    this.authservice.createAcount(id, nombre, apellido,telefono, direccion, nombre_empresa, fecha_nacimiento, image, email,password)
    //this.crudPostulantes.setPostulante(id, nombre, apellido,telefono, direccion, nombre_empresa, fecha_nacimiento, image, email)
  }
  
  removePostulantes(id,email,password){

    this.afs.object('emails/'+id).set({
      email:email,
      password:password,
      uid:id
    })
    
    this.crudPostulantes.removePostulantes(id);
    console.log(id)

   
   
   
    
  }

  goToMenu(){
    this.navCtrl.navigateForward('/menu')
  }
res
  eliminarUser(email, password){
    
   


    // this.res=this.afAuth.signInWithEmailAndPassword(email, password)
      

    //   const auth = getAuth();
    //   const user=auth.currentUser
    //   console.log(user)
    //   deleteUser(user)
    //     console.log("elminado user")
        
this.goToMenu()
    // User deleted.
  
       
    
     
  // deleteUser(uid).then(() => {
  //   // User deleted.
  // }).catch((error) => {
  //   // An error ocurred
  //   // ...
  // });
  
  }
  
  
}
