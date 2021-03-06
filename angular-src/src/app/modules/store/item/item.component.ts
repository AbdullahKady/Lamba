import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { StoreService } from '../../../services/store.service';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { appConfig } from "../../../app.config";
import {AuthService} from "../../../services/auth.service";


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  apiUrlHTML = appConfig.apiUrl;

  id: string;
  item: any;
  user: Object;
  owner: boolean

  myitems: any[];
  itemId: string;
  name: string;
  price: number;
  current: any;
  description: string;
  quantity: number;
  item_type: string;
  item_condition: string;
  picture_url: string;
  itemString: any;
  currentUser : any;

  constructor(private route: ActivatedRoute,
    private http: Http,
    private storeservice: StoreService,
    private modalService: NgbModal,
    private router: Router,
  private auth: AuthService) {
  }

  viewUser(id) {
    this.router.navigate(['profile', id]);
  }

  messageUser(id) {
    this.router.navigate(['chat/' + id]);
  }

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();

    this.route.params.subscribe(params => {
      this.id = params['id'];

      this.storeservice.getItem(this.id).subscribe(res => {
        this.item = res.data;
        this.user = res.seller;
        this.owner = res.owner;



      },
        error => {
          new Noty({
            type: 'error',
            text: `Something went wrong:\n ${error.error ? error.error.msg : error.msg}`,
            timeout: 3000,
            progressBar: true
          }).show()
          return this.router.navigate(["/store/myitems/view"]);
        });

    });
  }


  deleteProduct() {
    this.http.delete(appConfig.apiUrl + '/store/delete/' + this.item["_id"])
      .subscribe(res => {
        this.router.navigate(["/store/myitems/view"]);
      });

  }


  modalref: NgbModalRef;
  closeResult: string;


  open(content) {
    this.modalref = this.modalService.open(content)

    this.modalref.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editItem(item) {
    this.item = item;
    var itemId = item._id;

    this.name = this.item.name;
    this.price = this.item.price;
    this.description = this.item.description;
    this.quantity = this.item.quantity;
    this.item_type = this.item.item_type;
    this.item_condition = this.item.item_condition;


    let editedItem = {
      name: this.name,
      price: Number(this.price),
      description: this.description,
      quantity: Number(this.quantity),
      item_type: this.item_type,
      item_condition: this.item_condition,
      updated_at: Date.now()
    };

    this.http.patch(appConfig.apiUrl + '/store/edit/' + itemId, editedItem)
      .subscribe(res => {
        new Noty({
          type: 'success',
          text: 'Updated!',
          timeout: 3000,
          progressBar: true
        }).show();

        localStorage.setItem("Update", null);
        this.router.navigate(["/store/myitems/view"]);
      });

  }

  close() {

    this.router.navigate(["/store/myitems/view"]);
    localStorage.setItem("Update", 'null')

  }


}
