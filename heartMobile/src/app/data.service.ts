import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage,AngularFireUploadTask } from '@angular/fire/storage';
import 'rxjs/add/operator/map';


// import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private db: AngularFireDatabase, private afStorage:AngularFireStorage) { }

  getFiles(){
    let ref = this.db.list('files');
    return ref.snapshotChanges()
    .map(changes => {
      return changes.map(c => ({key:c.payload.key, ...c.payload.val() }));
    });
  }

  uploadToStorage(ideaContent): AngularFireUploadTask{
    // TODO: Generate random user id for different user
    let date = new Date().getTime();
    let fileName =  "_" + date
    return this.afStorage.ref('files/' + fileName).putString(ideaContent);
  }

// Store metadata in realtime database
  storeInfoToDatabase(metainfo){
    let toSave = {
      created: metainfo.timeCreated,
      fullpath:metainfo.fullPath,
      contentType:metainfo.contentType,
    }
    return this.db.list('files').push(toSave);
  }

  deleteFile(file){
    let key = file.key;
    let storagePath = file.fullpath;
// remove entry from database only
    this.db.list('files').remove(key);
// remove file from storage
    return this.afStorage.ref(storagePath).delete();
  }
}
