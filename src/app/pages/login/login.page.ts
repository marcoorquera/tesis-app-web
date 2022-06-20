import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { isDelegatedFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';

  errMessage = {
    'auth/user-not-found': 'Usuario no encontrado.',
    'auth/email-already-in-user':
      'El correo electrónico ya se encuentra en uso.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/too-many-requests':
      'Cuenta bloqueada. Ingrese a "Olvide mi contraseña" y restaure su contraseña.',
  };

  constructor(
    private afs: AngularFireDatabase,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private alertCtroller: AlertController,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });
    console.log('estoy iniciando');
  }

  async presentToast(m) {
    let toast = await this.toastCtrl.create({
      message: m,
      duration: 1000,
      position: 'middle',
    });

    toast.present();
  }

  adminperson;
  vendedor;
  postu_provee;
  ngOnInit() {

    // this.afs.object("admin/").valueChanges().subscribe(res => {
    //   this.administrador = res

    //   if (this.administrador === null) {

    //     console.log("No hay nada")

    //     this.authService.registerAdmin(this.email_admin, this.password, this.nombre_admin, this.apellido_admin, this.telefono_admin, " ", " ", " ", this.imagen_admin)

    //   } else {
    //     console.log("si hay algo", this.administrador)
    //   }
    // })

  }

  validation_messages = {
    email: [
      { type: 'required', message: 'Se requiere Email.' },
      { type: 'pattern', message: 'Ingrese un email válido.' },
    ],
    password: [
      { type: 'required', message: 'Se require contraseña.' },
      {
        type: 'minlength',
        message: 'La contraseña debe ser mayor a 5 caracteres',
      },
    ],
  };

  apellido_admin = 'Orquera Neacato';
  email_admin = 'marco.orquera@epn.edu.ec';
  imagen_admin = '';
  nombre_admin = 'Marco Alexander';
  telefono_admin = 3;
  password = '123456';
  administrador;

  loginUser(value) {
    this.authService.loginUser(value).then(
      (res) => {
        console.log('result', res);
        console.log('estpoy en el login 1');

        this.afs
          .object('admin/' + res.user.uid)
          .valueChanges()
          .subscribe((_data) => {
            this.adminperson = _data;
            if (this.adminperson != null) {
              const auth = getAuth();
              const user = auth.currentUser;
              if (
                res.user.uid == this.adminperson.id_admin &&
                this.adminperson.estado == true
              ) {
                if (user) {
                  this.navCtrl.navigateForward('/menu');
                } else {
                  this.afAuth.signOut();

                  this.validations_form.reset();
                }
              } else {
                var header = 'Información cuenta';
                var message = 'El administrador a desactivado su cuenta';
                this.userAccess(header, message);
                this.afAuth.signOut();
              }
            }

            // if (this.adminperson!=null && res.user.uid == this.adminperson.id_admin && this.adminperson.estado==true ){
            //   this.navCtrl.navigateForward("/menu");

            // }
            else {
              this.afs
                .object('vendedor/' + res.user.uid)
                .valueChanges()
                .subscribe((_data) => {
                  this.vendedor = _data;

                  if (this.vendedor != null) {
                    const auth = getAuth();

                    const user = auth.currentUser;

                    if (
                      res.user.uid == this.vendedor.uid_vendedor &&
                      this.vendedor.estado == true
                    ) {
                      if (user) {
                        this.navCtrl.navigateForward('/menu-vendedor');
                      } else {
                        //this.navCtrl.navigateBack('/inicio')
                        this.afAuth.signOut();

                        this.validations_form.reset();
                      }

                      console.log(
                        'estoy dentro del login del vendedor',
                        res.user.uid,
                        this.vendedor.uid_vendedor,
                        this.vendedor.estado,
                        true
                      );
                    } else {
                      console.log('entrando al esle');

                      var header = 'Información cuenta';
                      var message = 'El administrador a desactivado su cuenta';
                      this.presentToast(message);

                      //this.navCtrl.navigateBack('/inicio')
                      this.afAuth.signOut();

                      this.validations_form.reset();

                      return 0;
                    }
                  } else {
                    this.afs
                      .object('postulante_proveedor/' + res.user.uid)
                      .valueChanges()
                      .subscribe((_data) => {
                        this.postu_provee = _data;
                        console.log(this.postu_provee);
                        if (
                          this.postu_provee != null &&
                          res.user.uid == this.postu_provee.uid
                        ) {
                          var header = 'Información cuenta';
                          var message = 'Su solicitud se encuentra en progreso';
                          this.userAccess(header, message);
                        } else {
                          var header = 'Información';
                          var message = 'No se a encontrado la cuenta';
                          this.userAccess(header, message);
                        }
                      });
                  }
                });
            }
          });
      },
      (err) => {
        this.errorMessage = this.errMessage[err.code];
        console.log(err.code);
      }
    );
  }

  async userAccess(header: string, message: string) {
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'exit',
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
