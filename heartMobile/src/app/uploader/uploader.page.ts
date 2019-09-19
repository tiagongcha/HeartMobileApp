import { Component } from '@angular/core';
import { DataService } from '../data.service';
import {Observable} from 'rxjs/Rx';
import { AlertController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-tab2',
  templateUrl: 'uploader.page.html',
  styleUrls: ['uploader.page.scss']
})
export class UploaderPage {

  files: Observable<any[]>;
  constructor(
    private iab: InAppBrowser,
    private dataService: DataService,
    public alert: AlertController,
    public toastCtrl: ToastController,
    private camera: Camera,
    private file: File
  ) {
    this.files = this.dataService.getFiles();
  }

  fileChanged(event){
    const files = event.target.files;
    console.log(files);
  }

   async addFile(){
    const alert = await this.alert.create({
      header: 'Store new information',
      inputs:[
        {
        name: 'info',
        placeholder:'Lorem ipsum dolor ...'
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
            this.uploadInformation(data.info);
          }
        }
      ]
    });
    await alert.present();
  }

  // async addFile(){
  //   this.showAlert("Store new Information");
  // }
  //
  // async showAlert(header: string){
  //   const alert = await this.alert.create({
  //     header,
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
  //   await alert.present()
  // }

  async uploadInformation(text){
      const upload = this.dataService.uploadToStorage(text);
      upload.then().then(async res =>{
        console.log("res: ", res);
        this.dataService.storeInfoToDatabase(res.metadata).then(async ()=>{
          const toast = await this.toastCtrl.create({
            message:'New File added!',
            duration: 3000
          });
          toast.present();
        });
      });
  }

  async deleteFile(file){
    this.dataService.deleteFile(file).subscribe(async () => {
      const toast = await this.toastCtrl.create({
        message:'File Removed!',
        duration: 3000
      });
      toast.present();
    });
  }

async  viewFile(url){
  await this.iab.create(url);
  }





  async pickImage() {
      const options: CameraOptions = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      // this.camera.getPicture(options).then((imageData) => {
      //   // imageData is either a base64 encoded string or a file URI
      //   // If it's base64 (DATA_URL):
      //   let base64Image = 'data:image/jpeg;base64,' + imageData;
      // }, (err) => {
      //   alert("File Upload Error " + err.message);
      //     // Handle error
      //   });

      try {

        let cameraInfo = await this.camera.getPicture(options);
        let blobInfo = await this.makeFileIntoBlob(cameraInfo);
        let uploadInfo: any = await this.uploadToFirebase(blobInfo);

        alert("File Upload Success " + uploadInfo.fileName);
      } catch (e) {
        console.log(e.message);
        alert("File Upload Error " + e.message);
      }
    }

    // FILE STUFF
    makeFileIntoBlob(_imagePath) {
      // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
      return new Promise((resolve, reject) => {
        let fileName = "";
        this.file
          .resolveLocalFilesystemUrl(_imagePath)
          .then(fileEntry => {
            let { name, nativeURL } = fileEntry;

            // get the path..
            let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
            console.log("path", path);
            console.log("fileName", name);

            fileName = name;

            // we are provided the name, so now read the file into
            // a buffer
            return this.file.readAsArrayBuffer(path, name);
          })
          .then(buffer => {
            // get the buffer and make a blob to be saved
            let imgBlob = new Blob([buffer], {
              type: "image/jpeg"
            });
            console.log(imgBlob.type, imgBlob.size);
            resolve({
              fileName,
              imgBlob
            });
          })
          .catch(e => reject(e));
      });
    }

    /**
     *
     * @param _imageBlobInfo
     */
    uploadToFirebase(_imageBlobInfo) {
      console.log("uploadToFirebase");
      return new Promise((resolve, reject) => {
        let fileRef = firebase.storage().ref("images/" + _imageBlobInfo.fileName);

        let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);

        uploadTask.on(
          "state_changed",
          (_snapshot: any) => {
            console.log(
              "snapshot progess " +
                (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100
            );
          },
          _error => {
            console.log(_error);
            reject(_error);
          },
          () => {
            // completion...
            resolve(uploadTask.snapshot);
          }
        );
      });
    }
}
