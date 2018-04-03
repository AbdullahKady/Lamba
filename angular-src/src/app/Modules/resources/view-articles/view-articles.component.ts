import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ArticlesService } from '../articles.service';

@Component({
  selector: 'app-view-articles',
  templateUrl: './view-articles.component.html',
  styleUrls: ['./view-articles.component.css']
})
export class ViewArticlesComponent implements OnInit {
  public articles: any[] = [];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //GET THIS FROM POSTMAN'S LOGIN (won't work 3shan locally 3l database bta3ty)
      'Authorization': localStorage.getItem('authorization')
    })
  };
  constructor(private http: HttpClient, private articlesService: ArticlesService) { }

  ngOnInit() {
    this.articlesService.reloadArticles().subscribe((res: any) => {
      this.articlesService.setArticles(res.data.reverse());
      this.articles = this.articlesService.articles;
    }, err => {
      let msg = err.error.msg;
      alert(`Articles not retrieved: ${msg}`);
    });
  }



}
