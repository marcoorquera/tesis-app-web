import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { CrudPostulantesService } from 'src/app/services/crud-postulantes.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  customPickerOptions: any;
  CurrentDate: Date = new Date();
  fechaNacimiento: Date;
  archivos: any=[]

  
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  previsualizacion: string;
  email: string;
  password: string
  nombre: string;
  apellido: string;
  telefono: number;
  direccion: string;
  nombre_empresa: string;
  fecha_nacimiento: Date;

  validation_messages = {   
    
    'name': [
      { type: 'required', message: 'Se requiere nombre de usuario'},
    ],
    'apellido': [
      { type: 'required', message: 'Se requiere apellido de usuario'},
    ],
    'telefono': [
      { type: 'required', message: 'Se requiere telefono de usuario'},
    ],
    'direccion': [
      { type: 'required', message: 'Se requiere direccion de usuario'},
    ],
    'nombre_empresa': [
      { type: 'required', message: 'Se requiere nombre de empresa de usuario'},
    ],
    'fecha_nacimiento': [
      { type: 'required', message: 'Se requiere fecha de nacimiento de usuario'},
    ],
    'email': [
      { type: 'required', message: 'Se requiere email.' },
      { type: 'pattern', message: 'Ingrese un email valido.' }
    ],
    'password': [
      { type: 'required', message: 'Se requiere contraseña.' },
      { type: 'minlength', message: 'La contraseña debe ser mayor a 6 digitos.' }
    ]
  }


  constructor(
    private sanitizer: DomSanitizer,
    private crudPost: CrudPostulantesService,
    private alertCtroller: AlertController,    
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private afs: AngularFireDatabase,private afAuth: AngularFireAuth
    ) {
      this.validations_form = this.formBuilder.group({
      
        name: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])),
        apellido: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])),
        telefono: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])),
        direccion: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])),
        nombre_empresa: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])),
        fecha_nacimiento: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(5)
        ])),
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('', Validators.compose([
          Validators.minLength(6),
          Validators.required
        ])),
      });
   }

  ngOnInit() {
    
    console.log(localStorage)
    console.log(localStorage.length)
    console.log(localStorage.clear())
    console.log(localStorage)
    console.log(localStorage.length)

    
    
  }           

  capturarFile(event):any{
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen:any) => {
      this.previsualizacion = imagen.base
      console.log(imagen)
    })

    document.getElementById('img_upload').style.display = 'block';
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
  header:string;
  message:string
  tryRegister(){
    console.log("estoy dentro del tryregister")
    let dateTimestamp = this.fecha_nacimiento.toString()
    
    //console.log("fecha: "+this.fecha_nacimiento)
    //console.log("fecha string: "+dateTimestamp)
    if(!this.previsualizacion){
      this.imageController()
    }else{
     
      this.crudPost.register(this.email,this.password, this.nombre, this.apellido, this.telefono, this.direccion, this.nombre_empresa, dateTimestamp, this.previsualizacion)
     .then(res => {   
       console.log("ress ",res)
  
       //this.successMessage = "Su cuenta ha sido creada.";
       this.validations_form.reset()
       this.header='Solicitud de registro en revisión'
       this.message='El administrador revisará su información para que pueda entrar a su cuenta'
       this.afAuth.signOut()
       //console.log("fecha_nacimiento"+this.fechaNacimiento)       
       this.userRegistered(this.header,this.message)
       this.navCtrl.navigateBack("/inicio")
     }, err => {
      this.header='Error'
      this.message=err
      this.userRegistered(this.header,this.message)
       
      
       //this.errorMessage = "Este correo ya esta en uso";
       //this.successMessage = "";
     })
    }
    
  }
 


  async imageController(){
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'error',
      header: 'Error al registrar',
      message: 'ingrese una fotografía',
      buttons: ['OK']

    })
    await alert.present();
  }
  
  async userRegistered(header:string,message:string){
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'exit',
      header: header,
      message: message,
      buttons: ['OK']

    })
    await alert.present();
  }


}
