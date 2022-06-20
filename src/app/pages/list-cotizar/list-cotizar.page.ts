import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ModalController, NavController } from '@ionic/angular';
import { getAuth, updatePassword,onAuthStateChanged } from "firebase/auth";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list-cotizar',
  templateUrl: './list-cotizar.page.html',
  styleUrls: ['./list-cotizar.page.scss'],
})
export class ListCotizarPage implements OnInit {

  constructor(private modalCtrl: ModalController,
    private navCtrl: NavController,
    private afs: AngularFireDatabase,) {}

  ngOnInit() {
  
    const auth=getAuth()
    onAuthStateChanged(auth,user => {
    
      if(user){
        this.showProfile(user.uid)
        this.showDate()
        this.user=user.uid


       
      
       // this.showFechas()
      }  
    })
  }

  fechas
  user
  vendedor
  nombre_empresa
  img_empresa
  keys_usuario=[]
  keys_pedidos=[]
  data_final
  data
  precio
  fechaEnable
  userEnable
  pedidosEnable

  dataFinal
  id_fechas=[]
  num_fechas=[]
  tamanio_fecha
  showDate(){
    this.fechaEnable=false
    this.pedidosEnable=true
    this.userEnable=true
    this.afs.list("pedidos/").valueChanges().subscribe(data => {
      this.dataFinal=data
      this.dataFinal=this.dataFinal.map(item => {
        if(item.empresa_pedido==this.nombre_empresa){
        const list=item.fecha_pedido.split(' ')[0]
        this.id_fechas.push(list)
        }
      })
      
      //console.log('num fechas', this.id_fechas)
      let result = this.id_fechas.filter((item,index)=>{
        // console.log(item.empresa,index,'/////////')
        return this.id_fechas.indexOf(item) === index;
      })
      this.num_fechas=[]
      this.id_fechas=[]
      for (const i in result) {
        this.num_fechas.push({id: result[i]})
      }
      this.num_fechas.reverse()
     // console.log(this.num_fechas,'num fechas')
      this.tamanio_fecha=this.num_fechas.length+1
    })
  }
  
  data_user
  id_user=[]
  num_user=[]
  nombre_user
  user_name=[]
  personasMap
  fecha_pedido
  async showUser(fecha){
    this.fecha_pedido=fecha
    this.num_user=[]
    this.fechaEnable=true
    this.userEnable=false
    this.pedidosEnable=true
    this.afs.list("pedidos/").valueChanges().subscribe(data => {
      this.data_user=data
      this.data_user=this.data_user.map(item => {
       // console.log('usuario',item.fecha_pedido)
        const fecha1=item.fecha_pedido.split(' ')[0]
        //console.log('fecha1', item.id_usuario)
        if(fecha1==fecha && item.empresa_pedido==this.nombre_empresa ){
        this.id_user.push(item.id_usuario)
          this.num_user.push({id:item.id_usuario ,nombre:item.nombre_user, imagen:item.imagen_user, apellido:item.apellido_user,
          telefono:item.telefono_user, email:item.email_user, fecha: fecha})

        }
      })
      
      //console.log('num fechas', this.id_fechas)
      let result = this.id_user.filter((item,index)=>{
        // console.log(item.empresa,index,'/////////')
        return this.id_user.indexOf(item) === index;
      })
      result.reverse()
      this.num_user=[]
      this.id_user=[]
      for (let i = 0; i < result.length; i++) {
        this.afs.object("usuario/"+result[i]).valueChanges().subscribe(dlat=>{
          this.nombre_user=dlat
          this.num_user.push({id: result[i],nombre:this.nombre_user.nombre, imagen:this.nombre_user.imagen, apellido:this.nombre_user.apellido,
          telefono:this.nombre_user.telefono, email:this.nombre_user.email, fecha: fecha})
          this.personasMap = this.num_user.map(persona => {
            return [JSON.stringify(persona), persona]
        });
        let personasMapArr = new Map(this.personasMap); // Pares de clave y valor
        
        this.num_user = [...personasMapArr.values()]; // Conversión a un array
          
          
      })
        
  
       
      }

  });

    // const modal = this.modalCtrl.create({
    //   component: CotizarUserPage,
    //   componentProps: {
    //     fecha: fecha,
    //     nombre_empresa: this.nombre_empresa,
    //   },
    // });

    // return (await modal).present();
  }

  user_info
  nombre_usuario
  correo_usuario
  telefono_usuario
  imagen_usuario
  

  dataPedidos=[]
  dataProducts
  acum=0
  datos_pedidos
  showListPedidos(fecha, usuario){
    this.dataPedidos=[]
    this.fechaEnable=true
    this.userEnable=true
    this.pedidosEnable=false

    this.acum=0
    this.afs.object('usuario/'+usuario).valueChanges().subscribe(_data => {
      this.user_info = _data
      this.nombre_usuario=this.user_info.nombre+' '+this.user_info.apellido
      this.correo_usuario=this.user_info.email
      this.telefono_usuario=this.user_info.telefono
      this.imagen_usuario=this.user_info.imagen

      
    })


    this.afs.list("pedidos/").valueChanges().subscribe(data => {
      this.dataPedidos=[]
      
      this.acum=0
      this.data_user=data
      this.data_user=this.data_user.map(item => {
       // console.log('usuario',item.fecha_pedido)
        const fecha1=item.fecha_pedido.split(' ')[0]
        //console.log('fecha1', item.id_usuario)
        if(fecha1==fecha && item.empresa_pedido==this.nombre_empresa && item.id_usuario==usuario ){

         // this.afs.object("producto/"+item.id_prod).valueChanges().subscribe(data=>{
            this.dataProducts=data
            console.log('data',data)
            this.dataPedidos.push({imagen:item.imagen_pedido,
                                   cantidad:item.cantidad_pedido,
                                   nombreProducto:item.nombre_pedido,
                                   hora:item.fecha_pedido.split(' ')[1],
                                   costoUnidad:  Math.round(item.subtotal/item.cantidad_pedido * 100) / 100,
                                   subtotal:item.subtotal
            })
            this.acum+=item.subtotal

            this.datos_pedidos = this.dataPedidos.map(persona => {
              return [JSON.stringify(persona), persona]
          });
          let personasMapArr = new Map(this.datos_pedidos); // Pares de clave y valor
          
          this.dataPedidos = [...personasMapArr.values()]; // Conversión a un array
      
    
          
    
   

       //})
        
        
        

        }
     
      })

   
    })


  }

  async showProfile(user){
    await this.afs.object('vendedor/'+user).valueChanges().subscribe(_data => {
      this.vendedor = _data
      this.nombre_empresa=this.vendedor.nombre_empresa
      this.img_empresa = this.vendedor.image_vendedor;
      console.log(this.vendedor)
      console.log("this.nombre_empresa")
    })
  }
  goToMenu() {
    this.navCtrl.navigateForward('/menu-vendedor')
  }

  imprimir() {
    window.print();
  }
}
