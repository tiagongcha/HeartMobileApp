import { Component } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { AlertController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import { ActionSheetController } from '@ionic/angular';
import { DataService } from '../data.service';



import * as firebase from 'firebase/app';

@Component({
  selector: 'app-tab2',
  templateUrl: 'uploader.page.html',
  styleUrls: ['uploader.page.scss']
})
export class UploaderPage {
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  croppedImagepath = "";
  isLoading = false;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  files: Observable<any[]>;
  constructor(
    private iab: InAppBrowser,
    private dataService: DataService,
    public alert: AlertController,
    public toastCtrl: ToastController,
    private camera: Camera,
    private file: File,
    public actionSheetController: ActionSheetController,
  ) {
    // this.files = this.dataService.getFiles();
    this.myPhotosRef = firebase.storage().ref('/Photos/');
  }

  // fileChanged(event){
  //   const files = event.target.files;
  //   console.log(files);
  // }

  //  async addFile(){
  //   const alert = await this.alert.create({
  //     header: 'Store new information',
  //     inputs:[
  //       {
  //       name: 'info',
  //       placeholder:'Lorem ipsum dolor ...'
  //     }
  //   ],
  //
  //     buttons:[
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'Store',
  //         handler: data =>{
  //           this.uploadInformation(data.info);
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, (err) => {
      // Handle error
  });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

//   async uploadInformation(text){
//       const upload = this.dataService.uploadToStorage(text);
//       upload.then().then(async res =>{
//         console.log("res: ", res);
//         this.dataService.storeInfoToDatabase(res.metadata).then(async ()=>{
//           const toast = await this.toastCtrl.create({
//             message:'New File added!',
//             duration: 3000
//           });
//           toast.present();
//         });
//       });
//   }
//
//   async deleteFile(file){
//     this.dataService.deleteFile(file).subscribe(async () => {
//       const toast = await this.toastCtrl.create({
//         message:'File Removed!',
//         duration: 3000
//       });
//       toast.present();
//     });
//   }
//
// async  viewFile(url){
//   await this.iab.create(url);
//   }

 takeImage() {
    const options: CameraOptions = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      this.camera.getPicture(options).then(imageData => {
        this.myPhoto = imageData;
        this.uploadPhoto();
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    }

    private uploadPhoto(): void {
        this.myPhotosRef.child(this.generateUUID()).child('myPhoto.png')
          .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
          .then((savedPicture) => {
            this.myPhotoURL = savedPicture.downloadURL;
          });
      }

  private generateUUID(): any {
   var d = new Date().getTime();
   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
     var r = (d + Math.random() * 16) % 16 | 0;
     d = Math.floor(d / 16);
     return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
   });
   return uuid;
 }

}
