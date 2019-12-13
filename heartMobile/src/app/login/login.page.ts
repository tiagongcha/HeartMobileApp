import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  email: string = ""
  password: string = ""

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    public alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlert() {
      const alert = await this.alertController.create({
      message: 'wrong username/password',
      buttons: ['Dismiss']
     });
     await alert.present();
  }

// redirection to homepage only happens when user successfully login
loginUser(){
  const { email, password } = this
		var res = this.afAuth.auth.signInWithEmailAndPassword(email, password).then((success)=>{
        this.router.navigateByUrl('/tabs');
      }).catch((err)=>{
          this.presentAlert();
      })
}
}
