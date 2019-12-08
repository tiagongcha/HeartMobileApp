import { Content, Nav} from 'ionic-angular';
import { Component, OnInit, ViewChild} from '@angular/core';
import * as firebase from 'firebase/app';
import { IonContent } from "@ionic/angular";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit {

  data = {
    roomname:'',
    type:'',
    nickname:'',
    message:''
  };
  ref = firebase.database().ref('chatrooms/');
  roomkey:string;
  nickname:string;
  chats = [];
  offStatus:boolean = false;
  //@ViewChild('content',{static: false}) private content: any;
  @ViewChild(Nav, {static: false}) nav: Nav;
  //@ViewChild(Content,{static: false}) content: Content;
  @ViewChild(IonContent,{static: false}) content: IonContent;

  snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
};

  constructor() {
    // this.roomkey = this.navParams.get("key") as string;
    // this.nickname = this.navParams.get("nickname") as string; 
    //navController and nacParams not working somtimes, try to avoid to use these two
    this.roomkey = "roomkey"; 
    // only 1 chat room for the whole heart center 
    // if need more than 1 room, need to add page
    this.nickname = firebase.auth().currentUser.email;

    this.data.type = 'message';
    this.data.nickname = this.nickname;
    let joinData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
  joinData.set({
    type:'join',
    user:this.nickname,
    message:this.nickname+' has joined this room.',
    sendDate:Date()
  });
  this.data.message = '';
  firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
    this.chats = [];
    this.chats = this.snapshotToArray(resp);
    setTimeout(() => {
      if(this.offStatus === false) {
        if (this.content.scrollToBottom){
          this.content.scrollToBottom(300);
        }
      }
    }, 1000);
  });
   }

   addRoom(){
    let newData = this.ref.push();
    newData.set({
      roomname:this.data.roomname
    });
    this.nav.pop();
  }

  ngOnInit() {
  }

  sendMessage(){
    let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date()
    });
    this.data.message = '';
  }

  exitChat(){
    let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' has exited this room.',
      sendDate:Date()
    });
    this.offStatus = true;
    // this.navCtrl.setRoot({
    //   nickname:this.nickname
    // }); 
    // navController fails...
  }

  getUsername(){
    return firebase.auth().currentUser.email;
  }
}


//ref: https://www.djamware.com/post/5a629d9880aca7059c142976/build-ionic-3-angular-5-and-firebase-simple-chat-app