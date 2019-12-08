import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'firebase/auth';
import 'firebase/firestore';
import { Observable} from 'rxjs/Rx';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { AlertController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import * as firebase from 'firebase/app';



@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.page.html',
  styleUrls: ['./team-info.page.scss'],
})
export class TeamInfoPage implements OnInit {
  isAdmin: boolean;
  title:string;
  content:string;
  files: Observable<any[]>;

  constructor(
  private alert: AlertController,
  private toastCtrl: ToastController,
  private afStorage:AngularFireStorage,
  private db: AngularFireDatabase

  ) {
    this.files = this.getFiles();
  }


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

  getFiles(){
      let ref = this.db.list('teamView');
      return ref.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({key:c.payload.key, ...c.payload.val() }));
      })
    );
  }

  upload(){
    console.log(this.title);
    console.log(this.content);
    this.storeInfoToDatabase();
    // return this.afStorage.ref('teamView/' + this.title).putString(this.content);
  }

  storeInfoToDatabase(){
    let toSave = {
      title: this.title,
      content: this.content
    }
    return this.db.list('teamView').push(toSave);
  }

  // helpter method to help delete idea content from firebaseStorage and also delete metadata in db
      deleteFile(file){
        console.log("file key: " +file.key)
        let key = file.key;
        let storagePath = file.fullpath;
    // remove entry from database only
        return this.db.list('teamView').remove(key);
    // remove file from storage
        // return this.afStorage.ref(storagePath).delete();
      }

      async deleteFiles(file){
        console.log("heree")
        const alert = await this.alert.create({
          header: 'Confirm Delete Idea',
          message: 'Are you sure you want to permanently delete this article post?',
          buttons: [
                {
                  text: 'No',
                  handler: () => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Yes',
                  handler: () => {
                    this.deleteFile(file);
                  }
              }
          ]
        })
        await alert.present();
      }


}
