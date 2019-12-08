import { NavController, NavParams, Nav} from 'ionic-angular';
import { Component, OnInit, ViewChild} from '@angular/core';
import * as firebase from 'firebase/app';

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
  @ViewChild('content',{static: false}) private content: any; //not sure
  @ViewChild(Nav, {static: false}) nav: Nav;

  //not sure if this func will work
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
    this.roomkey = "roomkey";
    this.nickname = "dodgson";

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
        this.content.scrollToBottom(300);
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
    // might need to add?
  }

  getUsername(){
    console.log(firebase.auth().currentUser);
    return firebase.auth().currentUser.email;
  }
}
