import { AngularFireAuth } from '@angular/fire/auth';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPage = [
    {
      title:'Home',
      url:'tabs',
      icon:'home'
    },
    {
      title:'Idea Submit',
      url:'idea-submit',
      icon:"quote"
    },
    {
      title:'Team Overiew',
      url:'team-info',
      icon:"information-circle"
    },
    {
      title:'Google Drive',
      url:'drive',
      icon:"logo-google"
    },
    {
      title:'Useful Links',
      url:'link',
      icon:"archive"
    },
    {
      title:'News',
      url:'posts',
      icon:"bonfire"
    }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(){
    this.afAuth.auth.signOut().then(function() {
      // Sign-out successful.
      console.log("logout success")
    }).catch(function(error) {
  // An error happened.
    });
  }
}
