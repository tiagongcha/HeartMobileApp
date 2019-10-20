// import { Injectable } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';
// import { BehaviorSubject, Observable } from 'rxjs';
// import{ User } from '../user';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/switchMap';
// import * as firebase from 'firebase/app';
// import 'rxjs/add/operator/take';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   user: BehaviorSubject<User> = new BehaviorSubject(null)
//
//   constructor(private afAuth: AngularFireAuth,
//               private db: AngularFireDatabase) {
//
//                 this.afAuth.authState
//                 .pipe(
//                   switchMap(auth =>{
//                     if(auth){
//                       // sign in
//                       return this.db.object('users/' + auth.uid)
//                     }else{
//                       // not sign in
//                       return Observable.of(null)
//                     }
//                   })
//                 )
//                 .subscribe(user=>{
//                   this.user.next(user)
//                 })
//               }
// // sign in =sign out process:
//   googleLogin(){
//     const provider = new firebase.auth.GoogleAuthProvider()
//     return this.afAuth.auth.signInWithPopup(provider)
//     .then(credential => {
//       // this.updateUser(credential.user)
//       console.log("user info: " + credential.user)
//     })
//   }
//
//   signOut(){
//     this.afAuth.auth.signOut()
//   }
//
//   // private updateUser(authData){
//   //   const userData = new User(authData)
//   //   const ref = this.db.object('users/' + authData.uid)
//   //   ref.take(1)
//   //     .subscribe(user => {
//   //       if(!user.role){
//   //         ref.update(userData)
//   //       }
//   //     })
//   // }
//
// }
