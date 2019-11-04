import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { map } from 'rxjs/operators';
import { AlertController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Observable} from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-idea-submit',
  templateUrl: './idea-submit.page.html',
  styleUrls: ['./idea-submit.page.scss'],
})

export class IdeaSubmitPage implements OnInit {
  files: Observable<any[]>;
  ideaName:string;
  ideaContent:string;
  fileName:string;
  // showIdeaContent:Boolean=false;
  hideme=[];
  constructor(
    private alert: AlertController,
    private toastCtrl: ToastController,
    private iab: InAppBrowser,
    private db: AngularFireDatabase,
    private afStorage:AngularFireStorage)
    {
      this.ideaName = "";
      this.ideaContent = "";
      this.fileName = "";
      this.files = this.getFiles();
      // this.showIdeaContent = false;
    }

    getFiles(){
        let ref = this.db.list('files');
        return ref.snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({key:c.payload.key, ...c.payload.val() }));
        })
      );
    }

    uploadToStorage(ideaContent): AngularFireUploadTask{
      // TODO: Generate random user id for different user
      let date = new Date().getTime();
      // this.fileName =  this.ideaName + "_" + date
      this.fileName =  this.ideaName
      return this.afStorage.ref('files/' + this.fileName).putString(this.ideaContent);
    }

    storeInfoToDatabase(metainfo){
      let toSave = {
        created: metainfo.timeCreated,
        fullpath:metainfo.fullPath,
        contentType:metainfo.contentType,
        fileName:this.fileName,
        fileContent:this.ideaContent
      }
      return this.db.list('files').push(toSave);
    }

// helpter method to help delete idea content from firebaseStorage and also delete metadata in db
    deleteFile(file){
      console.log("file key: " +file.key)
      let key = file.key;
      let storagePath = file.fullpath;
  // remove entry from database only
      this.db.list('files').remove(key);
  // remove file from storage
      return this.afStorage.ref(storagePath).delete();
    }

    async addFile(){
     const alert = await this.alert.create({
       header: 'Submit new idea',
       inputs:[
         {
         name: 'ideaTitle',
         placeholder:'Idea Title'
       },
       {
         name:'ideaContent',
         placeholder:'Idea Content'
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
             console.log("idea name: " + data.ideaTitle)
             console.log("idea content: " + data.ideaContent)
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
        const upload = this.uploadToStorage(text);

        upload.then().then(async res =>{
          console.log("res: ", res.metadata);
          this.storeInfoToDatabase(res.metadata).then(async ()=>{
            const toast = await this.toastCtrl.create({
              message:'New File added!',
              duration: 3000
            });
            toast.present();
          });
        });
    }

    async deleteFiles(file){
      console.log("heree")
      const alert = await this.alert.create({
        header: 'Confirm Delete Idea',
        message: 'Are you sure you want to permanently delete this idea post?',
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
                  this.deleteFile(file).subscribe(async () => {
                    const toast = await this.toastCtrl.create({
                      message:'File Removed!',
                      duration: 3000
                    });
                    toast.present();
                  });
                }
            }
        ]
      })
      await alert.present();
    }


  // viewFile(url){
  //     this.showIdeaContent = !this.showIdeaContent;
  //     // await this.iab.create(url);
  //   }


  ngOnInit() {
  }

}
