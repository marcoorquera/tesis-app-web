import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root'
})
export class CrudCategoriaService {
 
  constructor(public afs: AngularFireDatabase) { }

  public getCategorias(){
    return this.afs.list('/categoria').valueChanges()
  }

  setCategorias(nombre_categoria: string){
    const id = this.afs.database.ref('/categoria/')
    const idCategoria = id.push().key

    this.afs.object('categoria/'+idCategoria).set({
      
      id_categoria: idCategoria,
      nombre_categoria: nombre_categoria,
    
    })
  }

  removeCategorias(id_categoria: string){
    this.afs.database.ref('categoria/'+id_categoria).remove();
  }

}
