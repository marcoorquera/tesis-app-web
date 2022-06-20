import { Injectable } from '@angular/core';
//firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
//navegacion
import { NavController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private AFauth: AngularFireAuth,
              private afs: AngularFireDatabase,
              private navCtrl: NavController,
              private storage: AngularFireStorage) { }

  loginUser(value){
    return new Promise<any>((resolve, reject) => {
    this.AFauth.signInWithEmailAndPassword(value.email, value.password).then(
    res => resolve(res),
    err => reject(err)
    )
    })
  }


  logoutUser(){
    return new Promise((resolve, reject) => {
      if(this.AFauth.currentUser){
          this.AFauth.signOut().then(()=>{
          this.navCtrl.navigateBack('/inicio')
          resolve;
        }).catch((error) => {
          reject();
        })
      }
    })
  }

  createAcount(id: string, nombre: string, apellido: string,telefono: number, direccion: string, nombre_empresa: string, fecha_nacimiento: string, image: string, email: string,password:string){
    
    return new Promise((resolve, reject) => {
      
      console.log("estoy en el create acount  1 ")
        this.storage.storage.ref('proveedor/'+id).putString(image, 'data_url').then(async(datos) => {
          await datos.ref.getDownloadURL().then((downloadURL) => {
            image=downloadURL;
            console.log("estoy en el create acount 2")
            this.afs.object('vendedor/'+id).set({
              uid_vendedor: id,
      nombre_vendedor: nombre,
      apellido_vendedor: apellido,
      fecha_nacimiento_vendedor: fecha_nacimiento,
      telefono_vendedor: telefono,
      direccion_vendedor: direccion,
      nombre_empresa: nombre_empresa,
      email_vendedor: email,
      image_vendedor: image,
      estado:true
              

            })
           
          
    
    this.afs.database.ref('postulante_proveedor/'+id).remove();
    this.afs.database.ref('emails/'+id).remove();
    

    resolve(downloadURL)
  },(err)=>{
    reject(err)

  })
  resolve(datos)
},(err)=>{
  reject(err)

})

        
        
    })
  }

  resetPassword(email: string){
    return this.AFauth.sendPasswordResetEmail(email);
  }

  registerAdmin(email: string, password: string, nombre: string, apellido: string, telefono: number,direccion: string, nombre_empresa: string, fecha_nacimiento: string ,image: string){
    return new Promise((resolve, reject) => {
      this.AFauth.createUserWithEmailAndPassword(email, password).then(res => {
        const uid = res.user.uid;
        // this.storage.storage.ref('admin/').putString(image, 'data_url').then(async(datos) => {
        //   await datos.ref.getDownloadURL().then((downloadURL) => {
        //     image=downloadURL;
            this.afs.object('admin/'+res.user.uid).set({
              id_admin: uid,
              nombre_admin: nombre,
              apellido_admin: apellido,
              //fecha_nacimiento: fecha_nacimiento,
              telefono_admin: telefono,
              // direccion: direccion,
              // nombre_empresa: nombre_empresa,
              email_admin: email,
              imagen_admin: image,
              estado:1
              

            })
            


        //     resolve(downloadURL)
        //   },(err)=>{
        //     reject(err)

        //   })
        //   resolve(datos)
        // },(err)=>{
        //   reject(err)

        // })
    resolve(res)
      },(err)=>{

        
        reject(err)
      })
    })
  }
  
  public getAadmin(){
    return this.afs.list('/admin').valueChanges()
  }


}
