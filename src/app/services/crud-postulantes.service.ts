import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
 
@Injectable({
  providedIn: 'root'
})
export class CrudPostulantesService {

  constructor(public afs: AngularFireDatabase,private AFauth: AngularFireAuth,
     private storage: AngularFireStorage) { }

  public getPostulantes(){
    return this.afs.list('/postulante_proveedor').valueChanges();
    
  }

  public getemails(){
    return this.afs.list('/emails').valueChanges();
    
  }

  public getPostulante(id){
    return this.afs.object('postulante_proveedor/'+id).valueChanges();
    
  }

  correoFiltr: any[];
  correoAngularList: AngularFireList<any>
  filtrcorreo: any[];

  

  register(email: string, password: string, nombre: string, apellido: string, telefono: number,direccion: string, nombre_empresa: string, fecha_nacimiento: string ,image: string){
    return new Promise((resolve, reject) => {
      this.AFauth.createUserWithEmailAndPassword(email, password).then(res => {
        const prod = this.afs.database.ref('/postulante_proveedor/')
        
        const uid = res.user.uid;
       
            
                  this.afs.object('postulante_proveedor/'+uid).set({
                    uid: uid,
                    nombre: nombre,
                    apellido: apellido,
                    fecha_nacimiento: fecha_nacimiento,
                    telefono: telefono,
                    direccion: direccion,
                    nombre_empresa: nombre_empresa,
                    email: email,
                    imagen: image,
                    password:password
      
                  })
                  // this.afs.object('emails/'+uid).set({
                  //   email:email
                  // })
                  
               

             

            

            
            
          
      

        
   resolve(res)
      },(err)=>{

        
        reject(err)
      })
    })
  }

  // setPostulante(id: string, nombre: string, apellido: string,telefono: number, direccion: string, nombre_empresa: string, fecha_nacimiento: string, image: string, email: string){
  //   this.afs.object('vendedor/'+id).set({
  //     uid_vendedor: id,
  //     nombre_vendedor: nombre,
  //     apellido_vendedor: apellido,
  //     fecha_nacimiento_vendedor: fecha_nacimiento,
  //     telefono_vendedor: telefono,
  //     direccion_vendedor: direccion,
  //     nombre_empresa: nombre_empresa,
  //     email_vendedor: email,
  //     image_vendedor: image,
  //     estado:true
  //   })

  //   this.afs.database.ref('postulante_proveedor/'+id).remove();
  // }

  removePostulantes(id:string){
    this.afs.database.ref('postulante_proveedor/'+id).remove()
  }

  
  


}
