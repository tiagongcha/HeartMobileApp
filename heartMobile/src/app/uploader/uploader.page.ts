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

// Reference: image upload code is implemented based on the tutorial:
// https://www.freakyjolly.com/ionic-4-image-upload-with-progress-in-firestore-and-firestorage-tutorial-by-application/

// Reference: file upload code is implemented based on the tutorial:
// https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/
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
  imageFiles=new Array();
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  UploadedFileURL: Observable<string>;
  images: Observable<MyData[]>;

  fileName:string;
  fileSize:number;

  isUploading:boolean;
  isUploaded:boolean;

  files: Observable<any[]>;

  imageCollection: AngularFirestoreCollection<MyData>;

  basePath:string = '/uploads';
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

  fileUpload(upload: Upload) {
      let storageRef = firebase.storage().ref();
      let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>  {
          upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          console.log(error)
        },
        () => {
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

  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  private deleteFileStorage(name:string) {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }

  detectFiles(event) {
      this.selectedFiles = event.target.files;
  }

// Method to upload single/multiple file:
  uploadMulti() {
    let files = this.selectedFiles
    let filesIndex = _.range(files.length)
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(files[idx]);
      this.fileUpload(this.currentUpload)}
    )
  }

// Method to upload images:
  uploadFile(event: FileList) {
    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') {
     console.error('only supports image')
     return;
    }
    this.isUploading = true;
    this.isUploaded = false;
    this.fileName = file.name;

    const path = `shareStorage/${new Date().getTime()}_${file.name}`;
    const imgRef = this.storage.ref(path);

    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        this.UploadedFileURL = imgRef.getDownloadURL();
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
    const id = this.database.createId();
    this.imageCollection.doc(id).set(image).then(response => {
      console.log(response);
    }).catch(error => {
      console.log("err" + error);
    });
  }

  downloadFile(fileName) {
    var that = this;
    this.afStorage.ref('uploads/' + fileName).getDownloadURL().toPromise().then(function(url){
      that.iab.create(url);
    }).catch(function(err){
      console.log(err)
    });
}
  downloadImage(img){
    this.iab.create(img);
  }

}
