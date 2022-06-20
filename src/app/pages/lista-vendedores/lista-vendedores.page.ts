import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { async } from '@firebase/util';
import { NavController, ToastController } from '@ionic/angular';
import { CrudProductosService } from 'src/app/services/crud-productos.service';
import {
  getAuth,
  deleteUser,
  onAuthStateChanged,
  updatePassword,
} from 'firebase/auth';

@Component({
  selector: 'app-lista-vendedores',
  templateUrl: './lista-vendedores.page.html',
  styleUrls: ['./lista-vendedores.page.scss'],
})
export class ListaVendedoresPage implements OnInit {
  constructor(
    private afs: AngularFireDatabase,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private cruP: CrudProductosService,

    private navCtrl: NavController
  ) {}

  //id_productos = [];
  user_vendedor
  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.showVendedores();
      
      } else {
        this.navCtrl.navigateBack('/inicio');
      }
    });
  }
  vendedor;
  showVendedores() {
    this.afs
      .list('vendedor/')
      .valueChanges()
      .subscribe((_data) => {
        this.vendedor = _data;
        console.log(this.vendedor);

        if (this.vendedor.length == 0) {
          this.presentToast();
        }
      });
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: 'No hay usuarios',
      duration: 2000,
      position: 'middle',
    });

    toast.present();
  }

  goToMenu() {
    this.navCtrl.navigateForward('/menu');
  }
  valor;
  isDisabled;
  est;
  async changeEstado(res, uid) {
    var id_productos=[]
    this.est = res.detail.checked;
    this.user_vendedor=uid
    this.afs.database.ref('vendedor/' + uid).update({
      estado: this.est,
    });
    await this.cruP.getProduct(uid).subscribe( (data) => {
      data.map((valores) => {
        id_productos.push(valores.id_prod);
      });
      var i
      console.log('length', id_productos.length);
      for ( i in id_productos) {
         this.afs.database
            .ref('producto/' + uid + '/' + id_productos[i])
            .update({
              estado: this.est,
            });
  
          this.afs.database.ref('producto/' + id_productos[i]).update({
            estado: this.est,
          });
        console.log('e finalizdo la captura de lso ids',i);
     
        
      }
      console.log('i',i)
      if(i==id_productos.length-1){
        console.log('entro');
        id_productos=[]
        i=0

              
      }
      //id_productos.pop()
      
    });
    console.log('obtener', id_productos.length)
    console.log('vendedor actualizar');
    console.log('vende', id_productos);
   
   
    //this.id_productos=[]

    //this.id_productos = [];
       
  }

    
}
