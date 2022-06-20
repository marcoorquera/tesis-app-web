import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase,AngularFireList, snapshotChanges } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CrudPromosService } from 'src/app/services/crud-promos.service';
import { AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { ModalController } from '@ionic/angular';
import { PromocionEditPage } from '../promocion-edit/promocion-edit.page';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.page.html',
  styleUrls: ['./promociones.page.scss'],
})
export class PromocionesPage implements OnInit {

  //input
  

  user = [];
  id_user: string;
  nombre_proveedor: string;
  img_vendedor: string;
  apellido_proveedor: string;
  empresa_proveedor: string;

  
  itemRef: AngularFireList<any>;
  item: Observable<any[]>;

  //promociones
  promociones = [];
  promocion: string;
  titulo_promocion: string;
  descripcion_promocion: string;
  previsualizacion: string;

  //disabled
  isDisabled: boolean = true;
  saveChanges: boolean = false;

  PromoForm: FormGroup;

  error_messages = {
    'titulo_promo': [
      { type: 'required', message: 'Ingrese un nombre de producto' },
      { type: 'minlength', message: 'El titulo de la promocion debe tener 5 o mas caracteres' },
      { type: 'maxlength', message: 'El titulo de la promocion debe tener  15 o menos caracteres' },

    ],
    'descripcion_promo': [
      { type: 'required', message: 'Ingrese la descripcion del producto' },
      { type: 'minlength', message: 'La descripcion del producto debe ser mayor a 5 caracteres' },
      { type: 'maxlength', message: 'La descripcion del producto debe ser menor a 50 caracteres' },
    ]
  }

  constructor(
    private sanitizer: DomSanitizer,
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private authservice: AuthService,
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private crudPromo: CrudPromosService,
    private alertCtroller: AlertController,
    private modalCtrl: ModalController
  ) {

    this.PromoForm = this.formBuilder.group({
      titulo_promocion: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20)
      ])),
      descripcion_promocion: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100)
      ]))
    })

  }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.id_user = user.uid;
        this.getPromo(user.uid)
        this.showProfile(user.uid)
      }else{
        this.navCtrl.navigateBack('/inicio');
      } 
    })
  }

  getPromo(uid){
      
    this.crudPromo.getPromo(uid).valueChanges().subscribe(
      list => {
        this.promociones = list
        console.log(this.promociones)
       
        
      }
    )
    
    
  }

  async edit2(id, nombre, descripcion, imagen){
    const modal = await this.modalCtrl.create({
      component: PromocionEditPage,
      componentProps: {
        id_promo: id,        
        name_promo: nombre,
        descripcion_promo: descripcion,
        image_promo: imagen 
      }
    })
    return await modal.present();
  }

  edit(item){
    this.saveChanges = false;
    this.isDisabled = false;

    item.id_promocion = item.old_id_promocion;
    item.titulo_promocion = item.old_titulo_promocion
    item.descripcion_promocion = item.old_descripcion_promocion;
    console.log("id: "+item.id_promocion)
    this.afs.database.ref('promociones/'+item.old_id_promocion).update({
      titulo_promo : item.titulo_promocion,
      descripcion_promo: item.descripcion_promocion,
      
    })

    console.log("promo titulo: "+item.titulo_promocion)

  }
  editPromo(item) {
    this.isDisabled = false;
    this.saveChanges = true;  
  }

  showProfile(uid) {
    this.afs.list('vendedor/' + uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_proveedor = this.user[7];
      this.apellido_proveedor = this.user[0];
      this.empresa_proveedor = this.user[6];
      this.img_vendedor = this.user[5];
      console.log("TESPROMOTION", _data)
    })
  }

  capturarFile(event): any{
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base
      console.log(imagen)
    })
    document.getElementById('img_upload').style.display = 'block';
  }
  
  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
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
    } catch (e) {
      return null;
    }
  })

  addPromo(){
    if(!this.previsualizacion){
      this.imageController()
    }else{
      this.afAuth.onAuthStateChanged(user => {
        if(user){
          this.crudPromo.addPromo(user.uid, this.previsualizacion, this.PromoForm.value.titulo_promocion, this.PromoForm.value.descripcion_promocion,this.empresa_proveedor)
          this.PromoForm.reset() 
          this.previsualizacion = '';       
        }
      })
    }
  }

  goToMenu() {
    this.navCtrl.navigateForward('/menu-vendedor')
  }

  removePromo(uid,id){
    this.crudPromo.removeProductos(uid,id);
    this.storage.storage.ref('promociones/'+uid+"/"+id)

  }
  async imageController() {
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'error',
      header: 'Error al registrar',
      message: 'ingrese una fotografía',
      buttons: ['OK']

    })
    await alert.present();
  }


}
