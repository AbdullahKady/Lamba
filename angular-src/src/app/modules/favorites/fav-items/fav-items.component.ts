import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fav-items',
  templateUrl: './fav-items.component.html',
  styleUrls: ['./fav-items.component.scss']
})
export class FavItemsComponent implements OnInit {
  items: any[];
  itemsInitialized: boolean;
  IMG_URL = 'http://localhost:3000/api/uploads/articlesThumbnails/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('authentication')
    })
  };

  constructor(private http: HttpClient,
    private router: Router) {
  }

  ngOnInit() {
    this.items = [];
    this.itemsInitialized = false;
    this.http.get('http://localhost:3000/api//user/favorites/items', this.httpOptions)
      .pipe().subscribe(
        (res: any) => {
          this.items = res.data.reverse();
          this.itemsInitialized = true;
        }, err => {
          this.router.navigate(['/']);
          new Noty({
            type: 'error',
            text: `Items could not be retrieved: ${err.error.msg}`,
            timeout: 3000,
            progressBar: true
          }).show();
        }
      );
  }
  removeByKey(array, params) {
    array.some(function (item, index) {
      if (array[index][params.key] === params.value) {
        array.splice(index, 1);
        return true;
      }
      return false;
    });
    return array;
  };

  remove(id) {
    this.http.delete('http://localhost:3000/api/user/favorites/items/' + id, this.httpOptions)
      .pipe().subscribe(
        (res: any) => {
          this.items = this.removeByKey(this.items, { key: '_id', value: id });
        }, err => {
          this.router.navigate(['/']);
          new Noty({
            type: 'error',
            text: `Item couldn't be removed from favorites : ${err.error.msg}`,
            timeout: 3000,
            progressBar: true
          }).show();
        }
      );
  }
}


