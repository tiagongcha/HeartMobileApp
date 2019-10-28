import { Component,OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab3',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss']
})
export class CalendarPage implements OnInit {

  event = {
    title:'',
    desc:'',
    startTime:'',
    endTime:'',
    allDay:false
  };

  // date picker
  minDate = new Date().toISOString();

  eventSource=[];
  viewTitle = '';

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  @ViewChild(CalendarComponent, {static: false}) myCal: CalendarComponent;

  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string, private db:AngularFirestore,) {
    this.db.collection('events').snapshotChanges().subscribe(colSnap =>{
      this.eventSource = [];
      colSnap.forEach(snap=>{
        let event:any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = event.startTime.toDate();
        event.endTime = event.endTime.toDate();
        this.eventSource.push(event);
      });
    });
   }

  ngOnInit(){
    this.resetEvent();
  }

  resetEvent(){
    this.event = {
      title:'',
      desc:'',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

// Create the right event format and reload source
  addEvent(){
      let eventCopy = {
        title: this.event.title,
        desc: this.event.desc,
        startTime:  new Date(this.event.startTime),
        endTime: new Date(this.event.endTime),
        allDay: this.event.allDay
      }

      if (eventCopy.allDay) {
        let start = eventCopy.startTime;
        let end = eventCopy.endTime;

        eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
        eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
      }
    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
    
    this.db.collection('events').add(eventCopy);
  }

  deleteEvent(event){
      this.db.doc(`events/${event.id}`).delete();
  }

  changeMode(mode){
    this.calendar.mode = mode;
  }

  back(){
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  next(){
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  today(){
    this.calendar.currentDate = new Date();
  }

  async onEventSelected(event){
    var answer = window.confirm("delete this event?")
    if (answer) {
      this.deleteEvent(event);
    }
    else {
      let start = formatDate(this.event.startTime, 'medium', this.locale);
      let end = formatDate(this.event.endTime, 'medium', this.locale);

      const alert = await this.alertCtrl.create({
        header: this.event.title,
        subHeader: this.event.desc,
        message: 'From: ' + start + '<br><br>To: ' + end,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  onViewTitleChanged(title){
    this.viewTitle = title;
  }

  onTimeSelected(ev){
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }
}

// export class CalendarPage {

//   eventSource =[];

//   calendar = {
//     mode: 'month',
//     currentDate: new Date(),
//   }

//   constructor(private db:AngularFirestore,){

//   }

//   addNewEvent(){
//     let now = new Date();
//     let event = {
//       title: 'Event #' + now.getMinutes();

//     }
//   }

// }