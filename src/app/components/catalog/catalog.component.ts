import { Component, ComponentFactoryResolver, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { CatalogItem } from './catalog';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormControlName, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from '../popup-success/popup-success.component';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class CatalogComponent implements OnInit {
  catalogUrl = 'https://msbit-exam-products-store.firebaseio.com/products.json';
  items: CatalogItem[] = [];
  itemsInCatalog: CatalogItem[] = [];
  filteredItems: any;
  searchText = "";
  chosenItem: any;
  chosenItemId: any;
  chosenItemPopup: any;
  chosenItemName: any;
  searchOptions: any[] = [ 'Name', 'Recently added', 'Price (from cheapest)', 'Price (from the most expensive)' ];
  selectedInput: any;
  submitSaveBtn!: string;
  itemsToShow = 4;

  productDetailsForm = new FormGroup({
    productImage: new FormControl,
    productName: new FormControl,
    productDescription: new FormControl,
    productPrice: new FormControl(null, [Validators.min(1), Validators.pattern("[0-9]+")]),
  })

  constructor(
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    ) {}

  ngOnInit(): void {
    this.catalogService.getAll().subscribe(items => {
      this.items = items;
      this.itemsInCatalog = this.items.slice(0, this.itemsToShow);
      console.log('what ',this.items)
      console.log('what 2 ',this.itemsInCatalog)
      this.selectedInput = 'Name';
      this.sorted();
    });
  }

  sorted() {
    if (this.selectedInput === this.searchOptions[0]) {
      return this.itemsInCatalog.sort((a: any,b: any) => a.name > b.name ? 1 : -1);
    } else if (this.selectedInput === this.searchOptions[1]) {
      return this.itemsInCatalog.sort((a: any,b: any) => a.creationDate < b.creationDate ? 1 : -1);
    } else if (this.selectedInput === this.searchOptions[2]) {
      return this.itemsInCatalog.sort((a: any,b: any) => a.price > b.price ? 1 : -1);
    } else if (this.selectedInput === this.searchOptions[3]) {
      return this.itemsInCatalog.sort((a: any,b: any) => a.price < b.price ? 1 : -1);
    }
    return this.itemsInCatalog;
  }

  searchBySelect(e: any) {
    this.selectedInput = e;
    this.sorted();
    return this.selectedInput;
  }

  addItem() {
    this.itemsInCatalog.unshift({
      creationDate: (new Date()).getTime(),
      description: 'add desc',
      id: (new Date()).getTime(),
      name: 'product ' + (new Date()).getTime(),
      price: 1000,
      thumbnailUrl: this.itemsInCatalog[this.itemsInCatalog.length-1].thumbnailUrl,
      url: this.itemsInCatalog[this.itemsInCatalog.length-1].thumbnailUrl,
    });
    this.items.unshift({
      creationDate: (new Date()).getTime(),
      description: 'add desc',
      id: (new Date()).getTime(),
      name: 'product ' + (new Date()).getTime(),
      price: 1000,
      thumbnailUrl: this.items[this.items.length-1].thumbnailUrl,
      url: this.items[this.items.length-1].thumbnailUrl,
    });
    console.log(this.items)
    return this.items;
  }

  onItemClicked(item: any){
    this.submitSaveBtn = '';
    this.chosenItem = item;
    this.chosenItemId = item.id;
    return this.chosenItem;
  }

  itemChosen() {
    this.chosenItem = this.itemsInCatalog.filter((el) => {
      return el.id === +this.chosenItemId;
    })
    return this.chosenItem[0];
  }

  setFormValue() {
    this.productDetailsForm.controls['productImage'].setValue(this.chosenItem[0].url);
    this.productDetailsForm.controls['productName'].setValue(this.chosenItem[0].name);
    this.productDetailsForm.controls['productDescription'].setValue(this.chosenItem[0].description);
    this.productDetailsForm.controls['productPrice'].setValue(this.chosenItem[0].price);
    return this.productDetailsForm;
  }

  deleteItem(btnItem: any) {
    this.items = this.items.filter((el) => {
      return el.id !== +btnItem.value;
    });
    this.itemsInCatalog = this.itemsInCatalog.filter((el) => {
      return el.id !== +btnItem.value;
    });
    if (this.filteredItems !== undefined) {
      this.filteredItems = this.filteredItems.filter((el: { id: number; }) => {
        return el.id !== +btnItem.value;
      })
    };
    return this.items;
  }

  onSearch() {
    if (this.searchText.length > 0) {
      this.filteredItems = this.itemsInCatalog.filter((el: any) => {
        return el.name.includes(this.searchText) || el.description.includes(this.searchText);
      })
    }
  }

  onSubmit() {
    this.chosenItemPopup = this.chosenItem[0];
    if (this.productDetailsForm.valid) {
      return this.productDetailsForm.value;
    } else {
      this.productDetailsForm.markAllAsTouched();
    }
  }

  saveChangesOfProduct() {
    this.productDetailsForm.setValue(this.productDetailsForm.value);
    this.itemsInCatalog = this.itemsInCatalog.map(obj => {
      if(obj.id === this.chosenItem[0].id) {
        this.chosenItem[0].url = this.productDetailsForm.controls['productImage'].value;
        this.chosenItem[0].name = this.productDetailsForm.controls['productName'].value;
        this.chosenItem[0].description = this.productDetailsForm.controls['productDescription'].value;
        this.chosenItem[0].price = this.productDetailsForm.controls['productPrice'].value;
        return {...obj}
      }
      return obj;
    })
    this.sorted();
    this.submitSaveBtn = 'submit';
    setTimeout(()=>{
      this.submitSaveBtn = '';
    }, 10000);
    return this.productDetailsForm.value;
  }

  openDialog() {
    let itemRef = this.dialog.open(PopupSuccessComponent, {
      data: { itemName: this.chosenItem[0].name }
    });
    return itemRef;
  }

  onChangePage(quantity: any) {
    this.itemsInCatalog = this.items.slice(quantity * this.itemsToShow, quantity * this.itemsToShow + this.itemsToShow);
  }

}
