import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
//firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
//navegacion
import { NavController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CrudProductosService {

  
  constructor(private AFauth: AngularFireAuth,
    private afs: AngularFireDatabase,
    private navCtrl: NavController,
    private storage: AngularFireStorage) { }

  addProduct(id_user:string,image_producto: string,categoria_producto: string, nombre_producto: string, precio_producto: number,descripcion_producto: string,nombre_proveedor: string, apellido_proveedor: string,nombre_empresa:string,image_empresa: string){
 
  
    return new Promise((resolve, reject) => {
      const uid=id_user
      const prod = this.afs.database.ref('/producto/'+uid+"/")
      const id_prod = prod.push().key
      this.storage.storage.ref('producto/'+uid+"/"+id_prod).putString(image_producto, 'data_url').then(async(datos) => {
        await datos.ref.getDownloadURL().then((downloadURL) => {
          image_producto=downloadURL;
          console.log(image_producto)
          this.afs.object('producto/'+uid+"/"+id_prod).set({
            
            uid_user: uid,
            id_prod: id_prod,
            cantidad:1,
            empresa_proveedor:nombre_empresa,
            nombre_producto: nombre_producto,
            categoria_producto: categoria_producto,
            precio_producto: precio_producto,
            descripcion_producto: descripcion_producto,
            image_empresa:image_empresa,
            image_producto: image_producto,
            apellido_proveedor:apellido_proveedor,
            nombre_proveedor:nombre_proveedor,
            estadoP:true,
          
            estado:1,
            url3D:" ",
            u3d:"No cargada"
          })
        })
      })
      this.storage.storage.ref('producto/'+id_prod).putString(image_producto, 'data_url').then(async(datos) => {
        await datos.ref.getDownloadURL().then((downloadURL) => {
          image_producto=downloadURL;
          console.log(image_producto)
          this.afs.object('producto/'+id_prod).set({
            
            uid_user: uid,
            id_prod: id_prod,
            cantidad:1,
            empresa_proveedor:nombre_empresa,
            nombre_producto: nombre_producto,
            categoria_producto: categoria_producto,
            precio_producto: precio_producto,
            descripcion_producto: descripcion_producto,
            image_empresa:image_empresa,
            image_producto: image_producto,
            apellido_proveedor:apellido_proveedor,
            nombre_proveedor:nombre_proveedor,
            estadoP:true,
            estado:1,
            url3D:"",
            u3d:"No cargada"
          })
        })
      })


    })
  }
  
  

  removeProducto(uid,uid_prod: string){
    this.afs.database.ref('producto/'+uid+"/"+uid_prod).remove();
  }
  
  removeProducto1(uid_prod){
    this.afs.database.ref('producto/'+uid_prod).remove();
  }
  

  prodList: AngularFireList<any>
    getProduct(uid){

      
        this.prodList = this.afs.list('/producto/'+uid+"/");
        
        return this.prodList.snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({
              key: c.payload,
              ...c.payload.val()
            }))
          )
        )}

        subir3D(uid,id_prod,nombreArchivo: string, datos: any) {
          return this.storage.upload("3DIm/"+uid+"/"+id_prod+"/"+nombreArchivo, datos);
        }
      
        //Referencia del archivo
        ref3D(nombreArchivo: string) {
          return this.storage.ref(nombreArchivo);
        }
}