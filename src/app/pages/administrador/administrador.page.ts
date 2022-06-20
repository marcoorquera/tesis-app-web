import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CameraOptions, CameraResultType } from '@capacitor/camera';
import { Plugins } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getAuth, updatePassword,onAuthStateChanged } from "firebase/auth";

const { Camera } = Plugins


@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {
  user =[];
  nombre_admin: string;
  apellido_admin: string;
  email_admin: string;
  telefono_admin: number;


  constructor(
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController, public alertController: AlertController,private modalCtrl: ModalController,
    private storage: AngularFireStorage,private toastCtrl: ToastController,private navCtr: NavController,
    
    private authservice: AuthService) { }

  ngOnInit() {

    const auth=getAuth()
    onAuthStateChanged(auth,user => {
    
      if(user){
        this.showProfile(user.uid)
      }   else {
        this.navCtr.navigateBack('/inicio');
      }
    })
    
  }
  private isDisabled: boolean=true;
  saveChanges: boolean = false;
  //datos editados
  nombre_edited: string;
  apellido_edited: string;
  email_edited: string;
  telefono_edited: string;
  img_edited: string;

  goToMenu(){
    this.navCtrl.navigateForward('/menu')
  }

  showProfile(uid){
    console.log(uid)
    this.afs.list('admin/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      
      console.log(this.user)
      
    })
  }
  
  editProfile(){
    this.isDisabled = false;
    this.saveChanges = true;
    
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
          this.storage.storage.ref('admin/'+uid).putString(this.img_edited, 'data_url').then(async(datos) => {
            await datos.ref.getDownloadURL().then((downloadURL)=>{
              this.img_edited = downloadURL;
              this.afs.database.ref('admin/'+user.uid).update({
                imagen_admin: this.img_edited

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

  GuardarCambios(){
    
    this.saveChanges=false;     
    this.isDisabled = false;
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.afs.database.ref('admin/'+user.uid).update({
          nombre_admin: this.nombre_edited,
          apellido_admin: this.apellido_edited,
          telefono_admin: this.telefono_edited,
          email_admin: this.email_edited
        })
      }
      this.presentToast()
     this.isDisabled=true;
    this.saveChanges= false;
    })
    
  }
  
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: 'Datos actualizados corectamente',
      duration: 2000,
      position: 'middle'
    });
  
    
  
    toast.present();
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
          placeholder: 'Nueva Contraseña',
          type: 'password',
          
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
            if ((data.password)) {
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
                
                console.log(error)
                var m="No se pudo actualizar la contraseña inicie la sesion nuevamente e intentelo de nuevo"
                this.succesPassword(m)
                this.afAuth.signOut()
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


