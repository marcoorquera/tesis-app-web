import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CrudProductosService } from 'src/app/services/crud-productos.service';
import { AlertController } from '@ionic/angular';
import { ModalEditprodPage } from '../modal-editprod/modal-editprod.page';
import { getAuth, deleteUser,onAuthStateChanged } from "firebase/auth";


@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  archivos: any = [];
  user = [];
  nombre_proveedor: string;
  apellido_proveedor: string;


  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  //productos
  nombre_producto: string;
  categoria_producto: string;
  nombre_empresa:string;
  nombreempresa:string;

  precio_producto: number;
  descripcion_producto: string;
  previsualizacion: string;
  imagen_producto: string
  image_empresa:string
  im3D:string





  validation_messages = {

    'nombre_producto': [
      { type: 'required', message: 'Se requiere nombre de producto' },
    ],
    'categoria_producto': [
      { type: 'required', message: 'Se requiere escoger una categoria' },
    ],
    'precio_producto': [
      { type: 'required', message: 'Ingrese el precio del producto' },
      { type: 'minlength', message: 'El precio del producto debe ser mayor a 1 cifra' },
      { type: 'maxlength', message: 'La precio del producto debe ser menor a 4 cifra' },
    ],
    'descripcion_producto': [
      { type: 'required', message: 'Se requiere descripcion de producto' },
    ],
    'imagen_producto': [
      { type: 'required', message: 'Se requiere imagen de producto' },
    ]
  }




  constructor(
    private sanitizer: DomSanitizer,
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private authservice: AuthService,
    private formBuilder: FormBuilder,
    private crudProd: CrudProductosService,
    private alertCtroller: AlertController,
    private toastCtrl:ToastController,private modalCtrl: ModalController,
    public prodServ: CrudProductosService) {

      this.validations_form = this.formBuilder.group({
        nombre_producto: new FormControl('', Validators.compose([
          Validators.required,
          //Validators.minLength(4)
        ])),
        precio_producto: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4)
        ])),
        descripcion_producto: new FormControl('', Validators.compose([
          Validators.required,
          //Validators.minLength(10)
        ])),
        categoria_producto: new FormControl('', Validators.compose([
          Validators.required
        ])),
        nombre_empresa: new FormControl('', Validators.compose([
          Validators.required
        ]))
      })
      
     }
     iduser

  ngOnInit() {

    const auth=getAuth()
    onAuthStateChanged(auth,user => {
      this.iduser=user.uid

      if (user) {
        this.showProfile(user.uid)
        this.viewProduct(user.uid)
        //this.getProd(user.uid)
        this.viewcategor()




      }else{
        this.navCtrl.navigateBack('/inicio')
      } 
    })
  }

  showProfile(uid) {
    this.afs.list('vendedor/' + uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_proveedor = this.user[7];
      this.apellido_proveedor = this.user[0];
      this.nombre_empresa = this.user[6];
      this.image_empresa = this.user[5];
    })
  }
  mensajeArchivo
  nombreArchivo
  subir3Dimagen(event,id_prod) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Imagen : ${event.target.files[i].name} subida`;
        this.nombreArchivo = event.target.files[i].name;
        
        this.subirArchivo( event.target.files[i],id_prod)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }
  URLPublica
  subirArchivo(archivo3D:any,id_prod) {
  
    
    let tarea = this.crudProd.subir3D(this.iduser,id_prod,this.nombreArchivo, archivo3D).then(res=>{
      let referencia = this.crudProd.ref3D("3DIm/"+this.iduser+"/"+id_prod+"/"+this.nombreArchivo);
      referencia.getDownloadURL().subscribe((URL) => {
        this.URLPublica = URL;
        console.log("url de la imagen",this.URLPublica)


        this.afs.database.ref('producto/' + this.iduser+ "/" + id_prod + "/").update({
          url3D: this.URLPublica,
          u3d:"Cargada"
    
        })
       this.afs.database.ref('producto/' + id_prod + "/").update({
        url3D:  this.URLPublica,
        u3d:"Cargada"
    
        })
        
      });


    });
    

    //Cambia el porcentaje
    

   
    
  }
  capturarFile(event): any {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base
    })

    document.getElementById('img_upload').style.display = 'block';
    //this.archivos.push(archivoCapturado)
    //console.log(event.target.files)
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

  addProducto() {
    
    if (!this.previsualizacion) {
      this.imageController()
    } else {
      this.afAuth.onAuthStateChanged(user => {
        if (user) {

          this.crudProd.addProduct(user.uid, this.previsualizacion, this.categoria_producto, this.nombre_producto, this.precio_producto, this.descripcion_producto,this.nombre_proveedor,this.apellido_proveedor, this.nombre_empresa,this.image_empresa)

          this.nombre_producto=' ';
          this.categoria_producto=' ';
        
          this.precio_producto=0;
          this.descripcion_producto=' ';
          this.previsualizacion='';
          this.imagen_producto=''
          this.presentToast()
        }
      })
    }
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
  goToMenu() {
    this.navCtrl.navigateForward('/menu-vendedor')
  }
  productos
  viewProduct(uid) {
    // this.afs.list('producto/'+uid+"/", (ref) =>
    //     ref.orderByKey()
    //   );


    this.afs.list('producto/' + uid + "/").valueChanges().subscribe(data => {
      this.productos = data
    })

  }

  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: 'Producto Ingresado correctamente',
      duration: 1000,
     
    });
  
  
    toast.present();
  }

  categorias;
  async viewcategor() {

    await this.afs.list('categoria/').valueChanges().subscribe(data => {
      this.categorias = data
      console.log("productos del usuario ", this.categorias)

    })

  }
  activar(){

  }
  desactivar(){
    
  }
  async changeEstado(res, uid, id_prod) {
    console.log(res.detail.checked)

    await this.afs.database.ref('producto/' + uid + "/" + id_prod + "/").update({
      estadoP: res.detail.checked,

    })
   await this.afs.database.ref('producto/' + id_prod + "/").update({
      estadoP: res.detail.checked,

    })


  }
  removeProducto(uid,uid_prod){
    this.crudProd.removeProducto(uid,uid_prod);
    this.crudProd.removeProducto1(uid_prod)
  }

  async modalEditProd(image, nombre, descripcion, precio, categoria, id_prod, id_user, nombre_empresa){
    const modal = await this.modalCtrl.create({
      component: ModalEditprodPage,
      componentProps: {
        image_prod: image,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        
        categoria: categoria,
        id_prod: id_prod,
        id_user: id_user,
        nombre_empresa: nombre_empresa,
      
      }
    })
    return await modal.present();
  }
  
}