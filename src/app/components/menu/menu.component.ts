import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private navCtr: NavController) { }

  ngOnInit() {}
  
  goToLogin(){
    this.navCtr.navigateForward('/login')
  }

  goToHome(){
    this.navCtr.navigateForward('/inicio')
  }

  goToRegister(){
    this.navCtr.navigateForward('/register')
  }

}
