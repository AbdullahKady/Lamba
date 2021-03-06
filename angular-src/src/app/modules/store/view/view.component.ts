import {Component, OnInit} from '@angular/core';
import {StoreService} from '../../../services/store.service';
import {Router} from "@angular/router";
import * as $ from 'jquery';
import {appConfig} from "../../../app.config";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  apiUrlHTML = appConfig.apiUrl;

  itemsCount: number; // Total number of items
  limit: number; // Number of items per page
  curPage: number; // Number of the current page
  lastPageNumber: number;

  // TODO create item interface ?
  items: any[]; // Current items
  pages: any[]; // Holds the numbers of the pages available to be picked

  // Pagination: initializing p to one
  p: number = 1;
  filter;


  constructor(private StoreService: StoreService,
              private http: HttpClient,
              private router: Router) {
    this.limit = 20;
    this.curPage = 1;
    this.getItemCount();
  }

  ngOnInit() {
  }

  getItemCount() {
    this.StoreService.itemsCount().subscribe((data: any) => {
      this.itemsCount = data.data;
      this.lastPageNumber = Math.ceil(this.itemsCount / this.limit);
      this.loadPageBar(this.curPage);
    });
  }

  loadPage(page: number) {
    this.curPage = page;
    if (this.curPage == -1)
      this.curPage = this.lastPageNumber;
    this.loadPageBar(this.curPage);
    this.loadItems();
  }

  loadPageBar(page: number) {
    // The number of the first page relative to current page
    let min: number = 1 > this.curPage - 3 ? 1 : this.curPage - 3;
    // The number of the last page relative to current page
    let max: number = this.lastPageNumber < this.curPage + 3 ? this.lastPageNumber : this.curPage + 3;


    this.pages = new Array<number>(max - min + 1);

    for (let i = min, j: number = 0; i <= max; i++ , j++) {
      this.pages[j] = i;
    }
    this.loadItems();
  }


  loadItems() {
    this.StoreService.viewItems().subscribe((data: any) => {
      this.items = data.data;
    });
  }

  likeItems(item) {
    this.StoreService.likeItems(item).subscribe((data: any) => {
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i]._id == data._id) {
            this.items[i].likes_user_id = data.likes_user_id;
          }
        }
        this.ngOnInit();

        this.loadItems();

      }
      , error => {
        new Noty({
          type: 'info',
          text: "You already liked this item.",
          timeout: 3000,
          progressBar: true
        }).show();
      });
  }

  unlikeItems(item) {
    this.StoreService.unlikeItems(item).subscribe((data: any) => {
      this.items = data.data;

      this.ngOnInit();
    });
    this.loadItems();
  }

  viewInfo(_id) {
    this.router.navigate(['/store/view/' + _id]);
  }

  addToFav(item) {
    this.StoreService.addToFavorites(item._id).subscribe(
      (res: any) => {
        new Noty({
          type: 'success',
          text: `Added to favorites successfully`,
          timeout: 1500,
          progressBar: true
        }).show();
      },
      err => {
        if (err.status === 304) {
          new Noty({
            type: 'info',
            text: `Item is already in your favorites.`,
            timeout: 1500,
            progressBar: true
          }).show();
        } else {
          new Noty({
            type: 'warning',
            text: `Something went wrong while adding to favorites: ${err.error ? err.error.msg : err.msg}`,
            timeout: 2000,
            progressBar: true
          }).show();
        }
      }
    )
  }
}
