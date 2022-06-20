import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ModalController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject, snapshotChanges } from '@angular/fire/compat/database';
import { CrudCategoriaService } from 'src/app/services/crud-categoria.service';
@Component({
  selector: 'app-modal-editprod',
  templateUrl: './modal-editprod.page.html',
  styleUrls: ['./modal-editprod.page.scss'],
})
export class ModalEditprodPage implements OnInit {

  @Input() image_prod;
  @Input() nombre;
  @Input() descripcion;
  @Input() precio;
  @Input() categoria;
  @Input() id_prod;
  @Input() id_user;
  @Input() nombre_empresa;
  @Input() prodList;

  nombre_edited: string;
  descripcion_edited: string;
  precio_edited: string;

  categoria_edited: string;
  image_edited: string;

  categoriaList = [];

  constructor(
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private afs: AngularFireDatabase,
    private formBuilder: FormBuilder,
    private categoriaService: CrudCategoriaService
    ) { 
   

    }

  ngOnInit() {
    this.showCategoria()
    console.log("id prod: "+this.id_prod)
  }
  salir(){
    this.modalCtrl.dismiss()
  }

  showCategoria(){
    this.categoriaService.getCategorias().subscribe(categoria => {
      this.categoriaList = categoria
    })
  }

  capturarFile(event):any{
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen:any) => {
      this.image_prod = imagen.base
      console.log("imagen-cambiada"+this.image_prod)
    })
    //this.archivos.push(archivoCapturado)
    //console.log(event.target.files)
  }

  extraerBase64 = async($event: any) => new Promise((resolve, reject) => {
    try{
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          blob: $event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        })
      }
    }catch(e){
      return null;
    }
  }) 

  guardar(uid){
    console.log(uid)
    
      this.afs.database.ref('producto/'+uid+"/"+this.id_prod).update({
      nombre_producto: this.nombre,
      descripcion_producto: this.descripcion,
      precio_producto: this.precio,
      categoria_producto: this.categoria,
      image_producto: this.image_prod

    }) 
    this.guardar1()
   
  
  }
  guardar1(){
    
    
      this.afs.database.ref('producto/'+this.id_prod).update({
      nombre_producto: this.nombre,
      descripcion_producto: this.descripcion,
      precio_producto: this.precio,
      categoria_producto: this.categoria,
      image_producto: this.image_prod

    }) 
    
    this.modalCtrl.dismiss()
  }

  
  

}
