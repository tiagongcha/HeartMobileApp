import { Component,OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';

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

  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string) { }

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
        startTime:  new Date(this.event.startTime),
        endTime: new Date(this.event.endTime),
        allDay: this.event.allDay,
        desc: this.event.desc
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

  async onEventSelected(){
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
