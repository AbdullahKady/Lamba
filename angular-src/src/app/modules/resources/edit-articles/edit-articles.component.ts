import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {ArticlesService} from '../articles.service';
import {ActivatedRoute, Router} from '@angular/router';
import {appConfig} from "../../../app.config";

@Component({
  selector: 'app-edit-articles',
  templateUrl: './edit-articles.component.html',
  styleUrls: ['./edit-articles.component.css']
})
export class EditArticlesComponent implements OnInit {

  apiUrlHTML = appConfig.apiUrl;

  article: any = {};
  id: string;
  public title: String;
  public editorContent: String;
  tagsInitialized: boolean;
  allTags: { value: string, id: string }[];
  selectedTags: any[];
  public toolbarOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{script: 'sub'}, {script: 'super'}],
      [{indent: '-1'}, {indent: '+1'}],
      [{size: ['small', false, 'large', 'huge']}],
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      [
        {color: [].slice()},
        {background: [].slice()}
      ],
      [{font: [].slice()}],
      [{align: [].slice()}],
      ['clean'],
      ['video', 'link']
    ]
  };
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authentication')
    })
  };

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private articlesService: ArticlesService) {
  }

  ngOnInit() {
    this.tagsInitialized = false;
    this.selectedTags = [];
    this.allTags = [];
    this.articlesService.getAllTags().subscribe(
      (res: any) => {
        res.data.forEach(element => {
          this.allTags.push({value: element.name, id: element._id})
        });
        this.tagsInitialized = true;
      }, err => {
        new Noty({
          type: 'error',
          text: `Tags couldn't be retrieved: ${err.error ? err.error.msg : err.msg}`,
          timeout: 3000,
          progressBar: true
        }).show();
      }
    );

    this.id = this.route.snapshot.params['id'];

    this.articlesService.loadArticle(this.id).subscribe(
      (retrieved: any) => {
        this.article = retrieved.data;
        this.title = this.article.title;
        this.editorContent = this.article.content;
        this.article.tags.forEach(tag => {
          this.selectedTags.push(
            {
              value: tag,
              id: tag,
              display: this.allTags.find((element => {
                return element.id === tag;
              })).value
            }
          );
        });
      }, err => {
        new Noty({
          type: 'error',
          text: `Your article couldn't be retrieved: ${err.error ? err.error.msg : err.msg}`,
          timeout: 3000,
          progressBar: true
        }).show();
      }
    );
  }

  onEdit() {
    if (!this.title || !this.editorContent) {
      new Noty({
        type: 'warning',
        text: `Please fill in both the title and the post content`,
        timeout: 2500,
        progressBar: true
      }).show();
      return;
    }
    let body = {
      title: this.title,
      content: this.editorContent,
      approved: false,
      tags: (this.selectedTags.map(tag => tag.id))
    };

    this.http.patch(appConfig.apiUrl + '/articles/' + this.id, body, this.httpOptions)
      .pipe().subscribe(res => {
      this.router.navigate(['/resources']);
      new Noty({
        type: 'success',
        text: `Your post edit has been submitted successfully, it now awaits an admin approval before it goes live again.`,
        timeout: 3000,
        progressBar: true
      }).show();
    }, err => {
      let msg = err.error.msg;
      new Noty({
        type: 'error',
        text: `Something went wrong while editing your post: ${err.error ? err.error.msg : err.msg}`,
        timeout: 3000,
        progressBar: true
      }).show();
    });
  }

}
