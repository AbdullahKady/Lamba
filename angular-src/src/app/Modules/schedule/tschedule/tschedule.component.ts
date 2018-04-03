import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tschedule',
  templateUrl: './tschedule.component.html',
  styleUrls: ['./tschedule.component.css']
})
export class TscheduleComponent implements OnInit {

  public day = [];
  public sat = [];
  public sun = [];
  public mon = [];
  public tues = [];
  public wed = [];
  public thurs = [];
  public fri = [];

  constructor(private http: HttpClient) {

  }

  createTeacherSchedule(){
    //let user= JSON.parse(localStorage.getItem('currentUser')).user;

    this.http.post('http://localhost:3000/api/schedule/createTeacherSchedule/5ac015ff36680295c461476e',null ).subscribe((res: any) => {
      this.sat = res.data.saturday;
      this.sun = res.data.sunday;
      this.mon = res.data.monday;
      this.tues = res.data.tuesday;
      this.wed = res.data.wednesday;
      this.thurs = res.data.thursday;
      this.fri = res.data.friday;
    });

  }

  getTeacherSchedule(){
    //let user= JSON.parse(localStorage.getItem('currentUser')).user;

    this.http.get('http://localhost:3000/api/schedule/getTeacherSchedule/5ac015ff36680295c461476e').subscribe((res: any) => {
      this.sat = res.data.table.saturday;
      this.sun = res.data.table.sunday;
      this.mon = res.data.table.monday;
      this.tues = res.data.table.tuesday;
      this.wed = res.data.table.wednesday;
      this.thurs = res.data.table.thursday;
      this.fri = res.data.table.friday;

    });


  }



  ngOnInit() {
    this.getTeacherSchedule();
  }

   fsat() {
    this.day = this.sat;
  }
   fsun() {
    this.day = this.sun;
  }
   fmon() {
    this.day = this.mon;
  }
   ftues() {
    this.day = this.tues;
  }
   fwed() {
    this.day = this.wed;
  }
  fthurs() {
    this.day = this.thurs;
  }
   ffri() {
    this.day = this.fri;
  }


}