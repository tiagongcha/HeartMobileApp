import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AlertController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Observable} from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-link',
  templateUrl: './link.page.html',
  styleUrls: ['./link.page.scss'],
})
export class LinkPage implements OnInit {

  links: Observable<any[]>;
  linksTitle:string;
  linksContent:string;
  isAdmin: boolean;

  constructor(
    private alert: AlertController,
    private toastCtrl: ToastController,
    private db: AngularFireDatabase)
    {
      this.linksTitle = "";
      this.linksContent = "";
      this.links = this.getFiles();
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
      let ref = this.db.list('links');
        return ref.snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({key:c.payload.key, ...c.payload.val() }));
        })
      );
    }

    storeInfoToDatabase(){
      let toSave = {
        linkName:this.linksTitle,
        linkContent:this.linksContent
      }
      return this.db.list('links').push(toSave);
    }

    deleteFile(file){
      let key = file.key;
      this.db.list('links').remove(key);
    }

    async addFile(){
     const alert = await this.alert.create({
       header: 'Submit new link',
       inputs:[
         {
         name: 'linkTitle',
         placeholder:'Link Title'
       },
       {
         name:'linkContent',
         placeholder:'Link Content'
       }
     ],

       buttons:[
         {
           text: 'Cancel',
           role: 'cancel'
         },
         {
           text: 'Store',
           handler: data =>{
             this.linksTitle = data.linksTitle;
             this.linksContent = data.linksContent;
             this.uploadInformation(data.linksContent);
           }
         }
       ]
     });
     await alert.present();
    }

    async uploadInformation(text){
          this.storeInfoToDatabase().then(async ()=>{
            const toast = await this.toastCtrl.create({
              message:'New Link added!',
              duration: 3000
            });
            toast.present();
          });
    }

    async deleteFiles(file){
      console.log("heree")
      const alert = await this.alert.create({
        header: 'Confirm Delete Link',
        message: 'Are you sure you want to permanently delete this link?',
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
                  let key = file.key;
                  this.db.list('links').remove(key);
                }
            }
        ]
      })
      await alert.present();
    }
}
