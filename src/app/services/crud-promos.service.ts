import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class CrudPromosService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFireDatabase,
    private storage: AngularFireStorage) { 

  }

  promoList: AngularFireList<any>

  addPromo(id_user: string, image_promo: string, titulo_promo: string, descripcion_promo: string, nombre_empresa: string){
    return new Promise((resolve, reject) => {
      const uid = id_user;
      const promo = this.afs.database.ref('/promociones/'+id_user)
      const id_promo = promo.push().key;
      this.storage.storage.ref('promociones/'+id_user+"/"+id_promo).putString(image_promo, 'data_url').then(async(datos) => {
        await datos.ref.getDownloadURL().then((downloadURL) => {
          image_promo = downloadURL;
          this.afs.object('/promociones/'+id_user+"/"+id_promo).set({
            uid_user: uid,
            id_promo: id_promo,
            titulo_promo: titulo_promo,
            descripcion_promo: descripcion_promo,
            image_promo: image_promo,
            nombre_empresa: nombre_empresa,
            fecha: Date.now()
          })
        })
      })

      this.storage.storage.ref('promociones/'+id_promo).putString(image_promo, 'data_url').then(async(datos) => {
        await datos.ref.getDownloadURL().then((downloadURL) => {
          image_promo = downloadURL;
          this.afs.object('/promociones/'+id_promo).set({
            uid_user: uid,
            id_promo: id_promo,
            titulo_promo: titulo_promo,
            descripcion_promo: descripcion_promo,
            image_promo: image_promo,
            nombre_empresa: nombre_empresa,
            fecha: Date.now()
          })
        })
      })
    })
  }

  public getPromo(uid){
    this.promoList = this.afs.list('/promociones/'+uid);
    return this.promoList
  }

  public removeProductos(uid,id_promo){
    this.afs.database.ref('promociones/'+uid+"/"+id_promo).remove()

    this.afs.database.ref('promociones/'+id_promo).remove()
  }

}
