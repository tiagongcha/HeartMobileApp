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

  googleSignIn(){
      const provider = new firebase.auth.GoogleAuthProvider();
      return this.afAuth.auth.signInWithRedirect(provider)
        .then(result =>{
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = (<any>result).credential.accessToken;
          // The signed-in user info.
          var user = (<any>result).user;
          console.log("user " + token)
      })
  }
  async presentAlert() {
      const alert = await this.alertController.create({
      message: 'wrong username/password',
      buttons: ['Dismiss']
     });
     await alert.present();
  }

// redirectiont to homepage only happens when user successfully login
loginUser(){
  const { email, password } = this
		var res = this.afAuth.auth.signInWithEmailAndPassword(email, password).then((success)=>{
        this.router.navigateByUrl('/tabs');
        console.log("login success")
      }).catch((err)=>{
          this.presentAlert();
      })
}


}
