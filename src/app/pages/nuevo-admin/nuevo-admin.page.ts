import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { AlertController, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


@Component({
  selector: 'app-nuevo-admin',
  templateUrl: './nuevo-admin.page.html',
  styleUrls: ['./nuevo-admin.page.scss'],
})
export class NuevoAdminPage implements OnInit {

  validation_messages = {

    'name': [
      { type: 'required', message: 'Se requiere nombre de usuario' },
    ],
    'apellido': [
      { type: 'required', message: 'Se requiere apellido de usuario' },
    ],
    'telefono': [
      { type: 'required', message: 'Se requiere telefono de usuario' },
    ],
    // 'direccion': [
    //   { type: 'required', message: 'Se requiere direccion de usuario'},
    // ],
    // 'nombre_empresa': [
    //   { type: 'required', message: 'Se requiere nombre de empresa de usuario'},
    // ],
    // 'fecha_nacimiento': [
    //   { type: 'required', message: 'Se requiere fecha de nacimiento de usuario'},
    // ],
    'email': [
      { type: 'required', message: 'Se requiere email.' },
      { type: 'pattern', message: 'Ingrese un email valido.' }
    ],
    'password': [
      { type: 'required', message: 'Se requiere contraseña.' },
      { type: 'minlength', message: 'La contraseña debe ser mayor a 5 digitos.' }
    ]
  }



  constructor(private sanitizer: DomSanitizer,
    private authService: AuthService,
    private alertCtroller: AlertController,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth
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
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  validations_form: FormGroup;
  credencial
  ngOnInit() {

    const auth = getAuth()

    onAuthStateChanged(auth, user => {
      if (user) {
        this.showProfile(user.uid)
        this.viewAdmin(user.uid)
        // const auth = getAuth();
        // const us=user
        // auth.updateCurrentUser(us)

      } else {
        this.navCtrl.navigateBack('/inicio');
      }
    })
  }

  errorMessage: string = '';
  successMessage: string = '';

  previsualizacion: string;
  email: string;
  password: string
  nombre: string;
  apellido: string;
  telefono: number;
  // direccion: string;
  // nombre_empresa: string;
  // fecha_nacimiento: Date;
  user
  showProfile(uid) {
    this.afs.list('admin/' + uid).valueChanges().subscribe(_data => {
      this.user = _data


    })
  }

  goToMenu() {
    this.navCtrl.navigateForward('/menu')
  }
  capturarFile(event): any {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base
      console.log(imagen)
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
  header: string;
  message: string
  tryRegister(validations_form) {
    // let dateTimestamp = this.fecha_nacimiento.toString()

    if (!this.previsualizacion) {
      this.imageController()
    } else {

      this.authService.registerAdmin(this.email, this.password, this.nombre, this.apellido, this.telefono, 'this.direccion', ' this.nombre_empresa', 'dateTimestamp', this.previsualizacion)
        .then(res => {
          this.afAuth.signOut()
          this.navCtrl.navigateBack('/inicio')


          //this.successMessage = "Su cuenta ha sido creada.";
          this.validations_form.reset()
          this.header = 'Estado registro'
          this.message = 'Administrador creado '

          //console.log("fecha_nacimiento"+this.fechaNacimiento)       
          this.userRegistered(this.header, this.message)

        }, err => {
          this.header = 'Error'
          this.message = 'Este correo ' + this.email + ' ya esta en uso'
          this.userRegistered(this.header, this.message)


          //this.errorMessage = "Este correo ya esta en uso";
          //this.successMessage = "";
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

  async userRegistered(header: string, message: string) {
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'exit',
      header: header,
      message: message,
      buttons: ['OK']

    })
    await alert.present();
  }

  admins
  viewAdmin(uid) {
    // this.afs.list('producto/' + uid + "/", (ref) =>
    //   ref.orderByKey()
    // );

    this.afs.list('admin/').valueChanges().subscribe(data => {
      this.admins = data.filter(
        user => user['id_admin'] != uid
      )
    })
  }

  changeEstado(res, uid, id_admin) {
    console.log(res.detail.checked)
    this.afs.database.ref('admin/' + id_admin).update({
      estado: res.detail.checked,
    })
  }
}
