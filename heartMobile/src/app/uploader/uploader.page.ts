
import { Component } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import * as firebase from 'firebase/app';
import * as _ from "lodash";


export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

export class Upload {

  $key: string;
  file:File;
  name:string;
  url:string;
  progress:number;
  createdAt: Date = new Date();


  constructor(
    file:File) {
    this.file = file;
  }
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'uploader.page.html',
  styleUrls: ['uploader.page.scss']
})

export class UploaderPage {
// DISPLAY PHOTO TASK:
  imageFiles=new Array();
  // imageFiles: [];

// Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details
  fileName:string;
  fileSize:number;

  //Status check
  isUploading:boolean;
  isUploaded:boolean;
// file
  files: Observable<any[]>;

  private imageCollection: AngularFirestoreCollection<MyData>;

  private basePath:string = '/uploads';
  uploads:  Observable<Upload[]>;
  selectedFiles: FileList;
  currentUpload: Upload;

  constructor(private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private database: AngularFirestore,
    private iab: InAppBrowser,
    private afStorage:AngularFireStorage) {
    this.isUploading = false;
    this.isUploaded = false;
    //Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('shareImages');
    this.images = this.imageCollection.valueChanges();
    this.imageFiles = new Array();
    this.getFiles();
    this.files = this.listFiles();
  }
// list all image data for display
  private getFiles(){
    var storageRef = firebase.storage().ref('shareStorage');
    storageRef.listAll().then(result=>{

      result.items.forEach(imgRef=>{
        imgRef.getDownloadURL().then(url=>{
          // url of an image:
          console.log(url);
          this.imageFiles.push(url);
        }).catch(err=>{
          console.log("ererr "+err)
        });
      });
    });
  }
// list all file metadata for display
  listFiles(){
      let ref = this.db.list('uploads');
      return ref.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({key:c.payload.key, ...c.payload.val() }));
      })
    );
  }

  pushUpload(upload: Upload) {
      let storageRef = firebase.storage().ref();
      let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>  {
          // upload in progress
          upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          // upload failed
          console.log(error)
        },
        () => {
          // upload success
          upload.url = uploadTask.snapshot.downloadURL
          upload.name = upload.file.name
          this.saveFileData(upload)
        }
      );
    }

    // Writes the file details to the realtime db
    private saveFileData(upload: Upload) {
      if (upload.url == undefined) {
        upload.url = null;
      }
      this.db.list(`${this.basePath}/`).push(upload);
    }

  deleteUpload(upload: Upload) {
        this.deleteFileData(upload.$key)
        .then( () => {
          this.deleteFileStorage(upload.name)
        })
        .catch(error => console.log(error))
      }

    // Deletes the file details from the realtime db
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name:string) {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }

  detectFiles(event) {
      this.selectedFiles = event.target.files;
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file);
    this.pushUpload(this.currentUpload)
  }

  uploadMulti() {
    let files = this.selectedFiles
    let filesIndex = _.range(files.length)
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(files[idx]);
      this.pushUpload(this.currentUpload)}
    )
  }

  uploadFile(event: FileList) {
    // The File object
    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
     console.error('unsupported file type :( ')
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `shareStorage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'share Image Upload Demo' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp=>{
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
  }

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }

  downloadFile(fileName) {
    var that = this;
    this.afStorage.ref('uploads/' + fileName).getDownloadURL().toPromise().then(function(url){
      that.iab.create(url);
    }).catch(function(err){
      console.log("here")
      console.log(err)
    });
}
  downloadImage(img){
    this.iab.create(img);
  }

}

// import { Component } from '@angular/core';
// import { Observable} from 'rxjs/Rx';
// import { AlertController} from '@ionic/angular';
// import { ToastController } from '@ionic/angular';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { File } from '@ionic-native/file/ngx';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
// import { ActionSheetController } from '@ionic/angular';
//
//
// import * as firebase from 'firebase/app';
//
// @Component({
//   selector: 'app-tab2',
//   templateUrl: 'uploader.page.html',
//   styleUrls: ['uploader.page.scss']
// })
// export class UploaderPage {
//   public myPhotosRef: any;
//   public myPhoto: any;
//   public myPhotoURL: any;
//   croppedImagepath = "";
//   isLoading = false;
//   imagePickerOptions = {
//     maximumImagesCount: 1,
//     quality: 50
//   };
//
//   files: Observable<any[]>;
//   constructor(
//     private iab: InAppBrowser,
//     private dataService: DataService,
//     public alert: AlertController,
//     public toastCtrl: ToastController,
//     private camera: Camera,
//     private file: File,
//     public actionSheetController: ActionSheetController,
//   ) {
//     this.files = this.dataService.getFiles();
//     this.myPhotosRef = firebase.storage().ref('/Photos/');
//   }
//
//   fileChanged(event){
//     const files = event.target.files;
//     console.log(files);
//   }
//
//    async addFile(){
//     const alert = await this.alert.create({
//       header: 'Store new information',
//       inputs:[
//         {
//         name: 'info',
//         placeholder:'Lorem ipsum dolor ...'
//       }
//     ],
//
//       buttons:[
//         {
//           text: 'Cancel',
//           role: 'cancel'
//         },
//         {
//           text: 'Store',
//           handler: data =>{
//             this.uploadInformation(data.info);
//           }
//         }
//       ]
//     });
//     await alert.present();
//   }
//
//   pickImage(sourceType) {
//     const options: CameraOptions = {
//       quality: 100,
//       sourceType: sourceType,
//       destinationType: this.camera.DestinationType.FILE_URI,
//       encodingType: this.camera.EncodingType.JPEG,
//       mediaType: this.camera.MediaType.PICTURE
//     }
//
//     this.camera.getPicture(options).then((imageData) => {
//       this.myPhoto = imageData;
//       this.uploadPhoto();
//     }, (err) => {
//       // Handle error
//   });
//   }
//
//   async selectImage() {
//     const actionSheet = await this.actionSheetController.create({
//       header: "Select Image source",
//       buttons: [{
//         text: 'Load from Library',
//         handler: () => {
//           this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
//         }
//       },
//       {
//         text: 'Cancel',
//         role: 'cancel'
//       }
//       ]
//     });
//     await actionSheet.present();
//   }
//
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
//
//  takeImage() {
//     const options: CameraOptions = {
//         quality: 80,
//         destinationType: this.camera.DestinationType.FILE_URI,
//         encodingType: this.camera.EncodingType.JPEG,
//         mediaType: this.camera.MediaType.PICTURE
//       };
//       this.camera.getPicture(options).then(imageData => {
//         this.myPhoto = imageData;
//         this.uploadPhoto();
//       }, error => {
//         console.log("ERROR -> " + JSON.stringify(error));
//       });
//     }
//
//     private uploadPhoto(): void {
//         this.myPhotosRef.child(this.generateUUID()).child('myPhoto.png')
//           .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
//           .then((savedPicture) => {
//             this.myPhotoURL = savedPicture.downloadURL;
//           });
//       }
//
//   private generateUUID(): any {
//    var d = new Date().getTime();
//    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
//      var r = (d + Math.random() * 16) % 16 | 0;
//      d = Math.floor(d / 16);
//      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//    });
//    return uuid;
//  }
//
// }
