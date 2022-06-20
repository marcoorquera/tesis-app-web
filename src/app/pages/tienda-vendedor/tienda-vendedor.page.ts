import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { getAuth, deleteUser,onAuthStateChanged } from "firebase/auth";

@Component({
  selector: 'app-tienda-vendedor',
  templateUrl: './tienda-vendedor.page.html',
  styleUrls: ['./tienda-vendedor.page.scss'],
})
export class TiendaVendedorPage implements OnInit {

  user=[];
  
  nombre_vendedor: string;
  apellido_vendedor: string;
  email_vendedor: string;
  tlfono_vendedor: number;


  constructor(private afs: AngularFireDatabase,
              private afAuth: AngularFireAuth) { }

  ngOnInit() {

    const auth=getAuth()
    onAuthStateChanged(auth,user => {
      if(user){
        this.showProfile(user.uid)

      }      
    })
  }

  showProfile(uid){
    this.afs.list('vendedor/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_vendedor = this.user[3];
      this.apellido_vendedor = this.user[0];
      this.email_vendedor = this.user[1];
      this.tlfono_vendedor = this.user[4];
      console.log('nombre: '+this.nombre_vendedor)
      console.log('apellido: '+this.apellido_vendedor)      
      console.log('email: '+this.email_vendedor)
      console.log('telefono: '+this.tlfono_vendedor)
    })
  }

}
