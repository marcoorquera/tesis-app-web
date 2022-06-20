import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/compat/database';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CrudCategoriaService } from 'src/app/services/crud-categoria.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  //user
  user =[];
  nombre_admin: string;
  apellido_admin: string;

   
  //categoria
  nombre_categoria: string='';
  categorias=[];

  //validation_form 
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {   
    
    'nombre_categoria': [
      { type: 'required', message: 'Se requiere categoria del producto'},
    ],
    
  }



  constructor(private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private crudCategoria: CrudCategoriaService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      
      nombre_categoria: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1)
      ])),
  
    });
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.showProfile(user.uid)
        this.getCategorias()
        
      } else{
        this.navCtrl.navigateBack('/inicio');
      }  
    })
  }
  showProfile(uid){
    this.afs.list('admin/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      
    })
  }

  pushCategoria(validations_form){
   
    this.crudCategoria.setCategorias(this.nombre_categoria)
    console.log(this.nombre_categoria)
    this.validations_form.reset()

    this.presentToast()
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: 'Nueva categoria Ingresada',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  
  getCategorias(){
    this.crudCategoria.getCategorias().subscribe(categoria => {
      this.categorias = categoria;
      console.log("categorias:"+this.categorias)

    })
  }

  removeCategorias(id){
    this.crudCategoria.removeCategorias(id);
  }

  
  goToMenu(){
    this.navCtrl.navigateForward('/menu')
  }


}
