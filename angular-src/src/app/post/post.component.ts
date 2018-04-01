import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  encapsulation: ViewEncapsulation.None //To allow CSS classes dynamically (on the articles retrieved from the db)
})
export class PostComponent implements OnInit {
  public title: String;
  public articles: any[];
  public editorContent: String;
  public toolbarOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [
        { color: [].slice() },
        { background: [].slice() }
      ],
      [{ font: [].slice() }],
      [{ align: [].slice() }],
      ['clean'],
      ['video']
    ]
  };
  //TODO: Export it into a service.
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //GET THIS FROM POSTMAN'S LOGIN (won't work 3shan locally 3l database bta3ty)
      'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOnsiZmlyc3ROYW1lIjoiYWJkbyIsImxhc3ROYW1lIjoiaGVzaGFtIn0sInNjaGVkdWxlIjp7IlRpbWV0YWJsZSI6W10sImNyZWF0ZWRBdCI6IjIwMTgtMDMtMzBUMDU6NTE6NDcuOTIwWiIsInVwZGF0ZWRBdCI6IjIwMTgtMDMtMzBUMDU6NTE6NDcuOTIwWiJ9LCJteUl0ZW1zIjpbXSwiY2FydCI6W10sInF1YWxpZmljYXRpb25zIjpbXSwic3R1ZGVudHMiOltdLCJfaWQiOiI1YWJkZDA3Mzc2MDk5YzRhZTI3OTNhZWUiLCJlbWFpbCI6InBhcmVudDFAZ21haWwuY29tIiwicm9sZSI6IlBhcmVudCIsIl9fdiI6MH0sImlhdCI6MTUyMjU3MjcwNCwiZXhwIjoxNTIyNjE1OTA0fQ.aFyVgpspb3JArTdx6rUO__5xf17sFB0ZBY0yxiwV9wQ"
    })
  };
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.reloadArticles();
  }

  reloadArticles() {
    this.http.get('http://localhost:3000/api/articles', this.httpOptions)
      .pipe().subscribe((res: any) => {
        this.articles = res.data.reverse();
      }, err => {
        let msg = err.error.msg;
        alert(`Articles not retrieved: ${msg}`);
      });

  }

  onSubmit() {
    //TODO: Beuatify these alerts! ,_,
    if (!this.title || !this.editorContent) {
      alert("Please fill in both the title and the content");
      return;
    }
    let article = {
      title: this.title,
      content: this.editorContent
    };

    this.http.post('http://localhost:3000/api/articles', article, this.httpOptions)
      .pipe().subscribe(res => {
        this.reloadArticles();
      }, err => {
        let msg = err.error.msg;
        alert(`Article was not posted: ${msg}`);
      });
  }

  upvote(index: number) {

    let body = {
      article_id : this.articles[index]._id,
      mode : "upvote"
    }

    this.http.post('http://localhost:3000/api/articles/feedback', body , this.httpOptions)
      .pipe().subscribe(res => {
        this.reloadArticles();
      }, err => {
        let msg = err.error.msg;
        alert(`Article was not updated: ${msg}`);
      });

  }
  downvote(index: number) {
    let body = {
      article_id : this.articles[index]._id,
      mode : "downvote"
    }

    this.http.post('http://localhost:3000/api/articles/feedback', body , this.httpOptions)
      .pipe().subscribe(res => {
        this.reloadArticles();
      }, err => {
        let msg = err.error.msg;
        alert(`Article was not updated: ${msg}`);
      });

  }

}