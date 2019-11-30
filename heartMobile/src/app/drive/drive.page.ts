import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Observable} from 'rxjs/Rx';
import * as firebase from 'firebase/app';


declare var gapi: any;

@Component({
  selector: 'app-drive',
  templateUrl: './drive.page.html',
  styleUrls: ['./drive.page.scss'],
})
export class DrivePage implements OnInit {
  user$: Observable<firebase.User>;
  driveItems: any[];

  constructor(private afAuth: AngularFireAuth, private iab: InAppBrowser) {
    this.initClient();
    this.user$ = afAuth.authState;
  }

  initClient() {
    gapi.load("client", initSigninV2, () => {
      console.log('loaded')

      gapi.client.init({
        apiKey: "AIzaSyCi5Z5Ij8Zrh7ser_xm87wJWqVOjYIzm2c",
        clientId: "335376849565-7aad7fkgejf0ld60hpfar8ds51agkipq.apps.googleusercontent.com",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: "https://www.googleapis.com/auth/drive"
      })

      gapi.client.load("drive", "v3", () => console.log("loaded drive"));
    });

    function initSigninV2() {
    gapi.auth2.init({
        clientId: "335376849565-7aad7fkgejf0ld60hpfar8ds51agkipq.apps.googleusercontent.com",
    }).then(function (authInstance) {

    });
}

  }



  async googleSignIn() {
    const googleAuth = gapi.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    const credential = firebase.auth.GoogleAuthProvider.credential(token);

    await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  async getDrive() {
    this.listFiles();
    // this.retrieveAllFiles(function(whatever) {
    //   console.log(whatever);
    // });
  }

  //  execute(callback) {
  //   gapi.client.load('drive', 'v3', function() {
  //     callback();
  //   });
  // }

  retrieveAllFiles(callback) {
    var retrievePageOfFiles = function(request, result) {
      request.execute(function(resp) {
        result = result.concat(resp.items);
        var nextPageToken = resp.nextPageToken;
        if (nextPageToken) {
          request = gapi.client.drive.files.list({
            'pageToken': nextPageToken
          });
          retrievePageOfFiles(request, result);
        } else {
          callback(result);
        }
      });
    }
    var initialRequest = gapi.client.drive.files.list();
    retrievePageOfFiles(initialRequest, []);
  }

  listFiles() {
    gapi.client.load('drive', 'v3', function(){
      gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
      }).then(function(response) {
        // appendPre('Files:');
        var files = response.result.files;
        if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            // appendPre(file.name + ' (' + file.id + ')');
          }
        } else {
          // appendPre('No files found.');
        }
      });
    });
    }

  ngOnInit() {
  }
  // googleSignIn(){
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     this.afAuth.auth.signInWithRedirect(provider).then(result=> {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       var token = (<any>result).credential.accessToken;
  //       // The signed-in user info.
  //       var user = result.user;
  //       console.log(token)
  //       // ...
  //     }).catch(function(error) {
  //       // Handle Errors here.
  //       var errorCode = error.code;
  //       var errorMessage = error.message;
  //       // The email of the user's account used.
  //       var email = error.email;
  //       // The firebase.auth.AuthCredential type that was used.
  //       var credential = error.credential;
  //       // ...
  //     });
  // }


}
