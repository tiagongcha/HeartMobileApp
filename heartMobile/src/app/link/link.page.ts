// import { Component, OnInit } from '@angular/core';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { map } from 'rxjs/operators';
// import { AlertController} from '@ionic/angular';
// import { ToastController } from '@ionic/angular';
// import { Observable} from 'rxjs/Rx';
// import { Injectable } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
// import { Url } from 'url';


// @Injectable({
//   providedIn: 'root'
// })

// @Component({
//   selector: 'app-link',
//   templateUrl: './link.page.html',
//   styleUrls: ['./link.page.scss'],
// })
// export class LinkPage implements OnInit {

//   links: Observable<any[]>;
//   ideaName:string;
//   ideaContent:string;
//   linkName:string;
//   hideme=[];

//   constructor(
//     private alert: AlertController,
//     private toastCtrl: ToastController,
//     private iab: InAppBrowser,
//     private db: AngularFireDatabase,
//     private afStorage:AngularFireStorage)
//     {
//       this.ideaName = "";
//       this.ideaContent = "";
//       this.linkName = "";
//       this.links = this.getFiles();
//       // this.showIdeaContent = false;
//     }

//     getFiles(){
//       let ref = this.db.list('links');
//         return ref.snapshotChanges().pipe(map(changes => {
//         return changes.map(c => ({key:c.payload.key, ...c.payload.val() }));
//         })
//       );
//     }

//     uploadToStorage(ideaContent): AngularFireUploadTask{
//       // TODO: Generate random user id for different user
//       //let date = new Date().getTime();
//       this.linkName =  this.ideaName 
//       return this.afStorage.ref('links/' + this.linkName).putString(ideaContent);
//     }

//     storeInfoToDatabase(metainfo){
//       let toSave = {
//         created: metainfo.timeCreated,
//         fullpath:metainfo.fullPath,
//         contentType:metainfo.contentType,
//         linkName:this.linkName,
//         linkContent:this.ideaContent
//       }
//       return this.db.list('links').push(toSave);
//     }

// // helpter method to help delete idea content from firebaseStorage and also delete metadata in db
//     deleteFile(file){
//       console.log("file key: " +file.key)
//       let key = file.key;
//       let storagePath = file.fullpath;
//   // remove entry from database only
//       this.db.list('links').remove(key);
//   // remove file from storage
//       return this.afStorage.ref(storagePath).delete();
//     }

//     async addFile(){
//      const alert = await this.alert.create({
//        header: 'Submit new link',
//        inputs:[
//          {
//          name: 'ideaTitle',
//          placeholder:'Link Title'
//        },
//        {
//          name:'ideaContent',
//          placeholder:'Link Content'
//        }
//      ],

//        buttons:[
//          {
//            text: 'Cancel',
//            role: 'cancel'
//          },
//          {
//            text: 'Store',
//            handler: data =>{
//              console.log("idea name: " + data.ideaTitle)
//              console.log("idea content: " + data.ideaContent)
//              this.ideaName = data.ideaTitle;
//              this.ideaContent = data.ideaContent;
//              this.uploadInformation(data.ideaContent);
//            }
//          }
//        ]
//      });
//      await alert.present();
//     }

//     async uploadInformation(text){
//         const upload = this.uploadToStorage(text);

//         upload.then().then(async res =>{
//           console.log("res: ", res.metadata);
//           this.storeInfoToDatabase(res.metadata).then(async ()=>{
//             const toast = await this.toastCtrl.create({
//               message:'New Link added!',
//               duration: 3000
//             });
//             toast.present();
//           });
//         });
//     }

//     async deleteFiles(file){
//       console.log("heree")
//       const alert = await this.alert.create({
//         header: 'Confirm Delete Link',
//         message: 'Are you sure you want to permanently delete this link?',
//         buttons: [
//               {
//                 text: 'No',
//                 handler: () => {
//                     console.log('Cancel clicked');
//                 }
//             },
//             {
//                 text: 'Yes',
//                 handler: () => {
//                   this.deleteFile(file).subscribe(async () => {
//                     const toast = await this.toastCtrl.create({
//                       message:'Link Removed!',
//                       duration: 3000
//                     });
//                     toast.present();
//                   });
//                 }
//             }
//         ]
//       })
//       await alert.present();
//     }

//   ngOnInit() {
//   }

// }




import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AlertController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Observable} from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

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
  ideaName:string;
  ideaContent:string;
  linkName:string;
  hideme=[];

  constructor(
    private alert: AlertController,
    private toastCtrl: ToastController,
    private db: AngularFireDatabase)
    {
      this.ideaName = "";
      this.ideaContent = "";
      //this.linkName = "";
      this.links = this.getFiles();
    }

    getFiles(){
      let ref = this.db.list('links');
        return ref.snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({key:c.payload.key, ...c.payload.val() }));
        })
      );
    }

    storeInfoToDatabase(link){
      let toSave = {
        linkName:this.ideaName,
        linkContent:this.ideaContent
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
         name: 'ideaTitle',
         placeholder:'Link Title'
       },
       {
         name:'ideaContent',
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
            //  console.log("idea name: " + data.ideaTitle)
            //  console.log("idea content: " + data.ideaContent)
             this.ideaName = data.ideaTitle;
             this.ideaContent = data.ideaContent;
             this.uploadInformation(data.ideaContent);
           }
         }
       ]
     });
     await alert.present();
    }

    async uploadInformation(text){
          this.storeInfoToDatabase(text).then(async ()=>{
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

  ngOnInit() {
  }

}