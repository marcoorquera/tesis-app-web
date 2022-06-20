import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import { CameraOptions, CameraResultType } from '@capacitor/camera';
import { Plugins } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { getAuth, deleteUser,onAuthStateChanged,updatePassword } from "firebase/auth";


const { Camera } = Plugins

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.page.html',
  styleUrls: ['./vendedor.page.scss'],
})

export class VendedorPage implements OnInit {


  constructor(
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private authservice: AuthService,
    private toastCtrl:ToastController,public alertController: AlertController,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    const auth=getAuth()
    onAuthStateChanged(auth,user => {
      if(user){
        this.user_id=user.uid
        this.showProfile(user.uid)
      } else{
        this.afAuth.signOut()
      }      
    })
  }

  showProfile(uid){
    this.afs.list('vendedor/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
   
    })
  }

  goToMenu(){
    this.navCtrl.navigateForward('/menu-vendedor')
  }

  isDisabled: boolean=true;
  saveChanges: boolean = false;
  user =[];
  nombre_vendedor: string;
  apellido_vendedor: string;
  email_vendedor: string;
  telefono_vendedor: number;
  fecha_nacimiento_vendedor: string;
  direccion_vendedor: string;
  nombre_empresa: string;
  imagen_vendedor: string;
  año_actual: number;
  user_id
  

  //perfil edited
  nombre_edited: string;
  apellido_edited: string;
  direccion_edited: string;
  email_edited: string;
  empresa_edited: string;
  telefono_edited: string;
  fecha_nacimiento_edited: string;
  img_edited:string

  editProfile(){
    this.isDisabled = false;
    this.saveChanges = true;
    
  }

  GuardarCambios(){
    console.log("estoy dentro del guadra cambios")
    
    this.saveChanges=false;     
    this.isDisabled = false;
      console.log("estoy dentro del guadra cambios")
      if(this.user_id){
        console.log("estoy dentro del guadra cambios",this.user_id)
        console.log(this.nombre_edited,this.empresa_edited,this.fecha_nacimiento_edited)
        this.afs.database.ref('vendedor/'+this.user_id).update({
          
          nombre_vendedor: this.nombre_edited,
          apellido_vendedor: this.apellido_edited,
          telefono_vendedor: this.telefono_edited,
          email_vendedor: this.email_edited,
          direccion_vendedor:this.direccion_edited,
          nombre_empresa:this.empresa_edited,
          fecha_nacimiento_vendedor:this.fecha_nacimiento_edited

        })
      }
      this.presentToast()
     this.isDisabled=true;
    this.saveChanges= false;
   
    
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: 'Datos actualizados corecctamente',
      duration: 2000,
      position: 'middle'
    });
  
    
  
    toast.present();
  }
  takePicture(){
    let options: CameraOptions={
      quality: 100,
      resultType: CameraResultType.DataUrl,
      saveToGallery: true
    }
    Camera.getPhoto(options).then((result) => {
      console.log(result.dataUrl)
      if(result.dataUrl){
        this.img_edited = result.dataUrl;
        this.afAuth.authState.subscribe(user=>{
          const uid = user.uid;
          this.storage.storage.ref('vendedor/'+uid).putString(this.img_edited, 'data_url').then(async(datos) => {
            await datos.ref.getDownloadURL().then((downloadURL)=>{
              this.img_edited = downloadURL;
              this.afs.database.ref('vendedor/'+user.uid).update({
                image_vendedor: this.img_edited

              })
            })
          })

        })
        //console.log("image: "+this.src)
      }
    },(err)=>{
      alert(JSON.stringify(err));
    }
    )
  }

  
  async succesPassword(message){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'exit',
      header: "Cambio contraseña",
      message: message,
     
      buttons: ['OK']

    })
    await alert.present();
  }

 
  async changePassword() {
    let alert = this.alertController.create({
      header: 'Cambiar contraseña',
      inputs: [
        
        {
          name: 'password',
          placeholder: 'New Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            if ((data.username, data.password)) {
              const auth = getAuth();
              const user = auth.currentUser;
              const newPassword = data.password;
  
              updatePassword(user, newPassword).then(() => {
                // Update successful.
                console.log("contraseña actualizada")
                var m="Se a actualizado la contraseña correctamente"
                this.succesPassword(m)
                this.afAuth.signOut()

            

              }).catch((error) => {
                var m="No se pudo actualizar la contraseña inicie la sesion denuevo e intentelo denuevo"
                this.succesPassword(m)
                this.afAuth.signOut()
                
                console.log(error)
              });
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
   await (await alert).present()
  }
  
}