import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.page.html',
  styleUrls: ['./team-info.page.scss'],
})
export class TeamInfoPage implements OnInit {
  isAdmin: boolean;
  constructor() { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
    if (user) {
      firebase
        .firestore()
        .doc(`/userProfile/${user.uid}`)
        .get()
        .then(userProfileSnapshot => {
          this.isAdmin = userProfileSnapshot.data().isAdmin;
          console.log(this.isAdmin)
        });
    }
  });
  }

}
