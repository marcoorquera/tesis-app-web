import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

import { getAuth, onAuthStateChanged } from "firebase/auth";

@Component({
  selector: 'app-menu-vendedor',
  templateUrl: './menu-vendedor.page.html',
  styleUrls: ['./menu-vendedor.page.scss'],
})
export class MenuVendedorPage implements OnInit {

  user=[];

  image_vendedor: string;
  nombre_vendedor: string;
  nombre_empresa: string;
  apellido_vendedor: string;
  email_vendedor: string;
  tlfono_vendedor: number;

  constructor(
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtr: NavController,
    private authservice: AuthService) { }

  ngOnInit() {
    const auth=getAuth()
    
    onAuthStateChanged(auth,user => {
      if(user){
        this.showProfile(user.uid)

      } else{
        this.navCtr.navigateBack('/inicio')
        
      }      
    })
  }

  showProfile(uid){
    this.afs.list('vendedor/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_vendedor = this.user[7];
      this.nombre_empresa = this.user[6];
      this.image_vendedor = this.user[5];
      this.apellido_vendedor = this.user[0];
    })
  }

  goToProfile(){
    this.navCtr.navigateForward('/vendedor');
  }

  
  
  goToProductos(){
    this.navCtr.navigateForward('/productos')
  }
  goToPromocion(){
    this.navCtr.navigateForward('/promociones')
  }
  goToListCotizar(){
    this.navCtr.navigateForward('/list-cotizar')
  }
  

  logout(){
    this.authservice.logoutUser()
    this.navCtr.navigateBack('/inicio')
    
  }


  

}
