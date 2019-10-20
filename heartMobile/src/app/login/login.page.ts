import { Component, OnInit } from '@angular/core';
// import {AuthService } from '../services/auth.service'
// import { NavController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = ""
  password: string = ""

  constructor(private afAuth: AngularFireAuth,
  private router: Router) { }

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

loginUser(){
  const { email, password } = this
  try{
			var res = this.afAuth.auth.signInWithEmailAndPassword(email, password)
      console.log("login success")
      this.router.navigateByUrl('/tabs');
  } catch(err){
    console.dir(err)

    if(err.code == "auth/user-not-found"){
      console.log("user not found")
  }
}
}


}
