import { Component, ComponentFactoryResolver, ElementRef, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
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

export class CatalogComponent implements OnInit {
  catalogUrl = 'https://msbit-exam-products-store.firebaseio.com/products.json';
  items: CatalogItem[] = [];
  itemsInCatalog: CatalogItem[] = [];
  filteredItems: any;
  savedArray: any;
  searchText = "";
  chosenItem: any;
  chosenItemId: any;
  chosenItemPopup: any;
  chosenItemName: any;
  searchOptions: any[] = [ 'Name', 'Recently added', 'Price (from cheapest)', 'Price (from the most expensive)' ];
  selectedInput: any;
  submitSaveBtn!: string;
  itemsToShow = 4;
  currentPageQuantity: number = 0;

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
      this.filteredItems = this.items.slice(0, this.itemsToShow);
      this.selectedInput = this.searchOptions[0];
      this.sorted();
      this.savedArray = this.items;
    });
  }

  sorted() {
    if (this.selectedInput === this.searchOptions[0]) {
      this.items.sort((a: any,b: any) => a.name > b.name ? 1 : -1);
      this.itemsInCatalog = this.items.slice(0, this.itemsToShow);
      this.filteredItems = this.items.slice(0, this.itemsToShow);
      this.items = this.items.slice(0, this.items.length);
      return this.items;

    } else if (this.selectedInput === this.searchOptions[1]) {
      this.items.sort((a: any,b: any) => a.creationDate < b.creationDate ? 1 : -1);
      this.itemsInCatalog = this.items.slice(0, this.itemsToShow);
      this.filteredItems = this.items.slice(0, this.itemsToShow);
      this.items = this.items.slice(0, this.items.length);
      return this.items;

    } else if (this.selectedInput === this.searchOptions[2]) {
      this.items.sort((a: any,b: any) => a.price > b.price ? 1 : -1);
      this.itemsInCatalog = this.items.slice(0, this.itemsToShow);
      this.filteredItems = this.items.slice(0, this.itemsToShow);
      this.items = this.items.slice(0, this.items.length);
      return this.items;

    } else if (this.selectedInput === this.searchOptions[3]) {
      this.items = this.items.sort((a: any,b: any) => a.price < b.price ? 1 : -1);
      this.itemsInCatalog = this.items.slice(0, this.itemsToShow);
      this.filteredItems = this.items.slice(0, this.itemsToShow);
      this.items = this.items.slice(0, this.items.length);
      return this.items;
    }
    return this.items;
  }

  searchBySelect(e: any) {
    this.selectedInput = e;
    this.sorted();
    return this.selectedInput;
  }

  addItem() {
    this.items.unshift({
      creationDate: (new Date()).getTime(),
      description: 'add desc',
      id: (new Date()).getTime(),
      name: 'product ' + (new Date()).getTime(),
      price: 1000,
      thumbnailUrl: this.items[0].thumbnailUrl,
      url: this.items[0].url,
    });
    if (this.searchText.length === 0) {
      this.itemsInCatalog.unshift({
        creationDate: (new Date()).getTime(),
        description: 'add desc',
        id: (new Date()).getTime(),
        name: 'product ' + (new Date()).getTime(),
        price: 1000,
        thumbnailUrl: this.itemsInCatalog[0].thumbnailUrl,
        url: this.itemsInCatalog[0].url,
      });
      this.itemsInCatalog = this.itemsInCatalog.slice(0, this.itemsInCatalog.length);
      this.savedArray = this.items;

    } else if (this.searchText.length > 0) {
      this.filteredItems.unshift({
        creationDate: (new Date()).getTime(),
        description: 'add desc',
        id: (new Date()).getTime(),
        name: 'product ' + (new Date()).getTime(),
        price: 1000,
        thumbnailUrl: this.filteredItems[0].thumbnailUrl,
        url: this.filteredItems[0].url,
      });
      this.savedArray.unshift({
        creationDate: (new Date()).getTime(),
        description: 'add desc',
        id: (new Date()).getTime(),
        name: 'product ' + (new Date()).getTime(),
        price: 1000,
        thumbnailUrl: this.items[0].thumbnailUrl,
        url: this.items[0].url,
      });
      this.filteredItems = this.filteredItems.slice(0, this.filteredItems.length);
      this.savedArray = this.savedArray.slice(0, this.savedArray.length);
    }
    this.items = this.items.slice(0, this.items.length);
    return this.items;
  }

  onItemClicked(item: any){
    this.submitSaveBtn = '';
    this.chosenItem = item;
    this.chosenItemId = item.id;
    return this.chosenItem;
  }

  itemChosen() {
    if (this.searchText.length > 0) {
      this.chosenItem = this.filteredItems.filter((el: { id: number; }) => {
        return el.id === +this.chosenItemId;
      })
    } else {
      this.chosenItem = this.items.filter((el) => {
        return el.id === +this.chosenItemId;
      })
    }
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
    if (this.searchText.length > 0) {
      this.filteredItems = this.filteredItems.filter((el: { id: number; }) => {
        return el.id !== +btnItem.value;
      })
      this.items = this.items.filter((el) => {
        return el.id !== +btnItem.value;
      })
      this.savedArray = this.savedArray.filter((el: { id: number; }) => {
        return el.id !== +btnItem.value;
      })
    } else {
      this.items = this.items.filter((el) => {
        return el.id !== +btnItem.value;
      });
      this.itemsInCatalog = this.itemsInCatalog.filter((el) => {
        return el.id !== +btnItem.value;
      });
      this.savedArray = this.items;
    }
    return this.items;
  }

  onSearch() {
    this.items = this.savedArray;
    if (this.searchText.length > 0) {
      this.items = this.items.filter((el: any) => {
        return el.name.includes(this.searchText) || el.description.includes(this.searchText);
      })
      this.filteredItems = this.items.slice(0, this.itemsToShow);
      return this.items;
    } else if (this.searchText.length === 0) {
      this.items = this.savedArray;
      this.sorted();
      return this.items;
    }
    return this.items;
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
    this.items = this.savedArray;
    this.items = this.items.map(obj => {
      if(obj.id === this.chosenItem[0].id) {
        this.chosenItem[0].url = this.productDetailsForm.controls['productImage'].value;
        this.chosenItem[0].name = this.productDetailsForm.controls['productName'].value;
        this.chosenItem[0].description = this.productDetailsForm.controls['productDescription'].value;
        this.chosenItem[0].price = this.productDetailsForm.controls['productPrice'].value;
        if (this.searchText.length > 0) {
          obj= this.chosenItem[0];
        }
        return {...obj}
      }
      return obj;
    })
    this.savedArray = this.items;
    this.searchText = '';
    this.onSearch();
    this.sorted();
    this.submitSaveBtn = 'submit';
    setTimeout(()=>{
      this.submitSaveBtn = '';
    }, 10000);
    return this.items;
  }

  openDialog() {
    let itemRef = this.dialog.open(PopupSuccessComponent, {
      data: { itemName: this.productDetailsForm.controls['productName'].value }
    });
    return itemRef;
  }

  onChangePage(quantity: number) {
    this.currentPageQuantity = quantity;
    this.itemsInCatalog = this.items.slice(quantity * this.itemsToShow, quantity * this.itemsToShow + this.itemsToShow);
    if (this.searchText.length > 0) {
      this.filteredItems = this.items.slice(quantity * this.itemsToShow, quantity * this.itemsToShow + this.itemsToShow);
    }
    if (this.itemsInCatalog.length === 0) {
      if (this.items.length / this.itemsToShow % 1 === 0) {
        quantity = Math.floor(this.items.length / this.itemsToShow) - 1;
      } else {
        quantity = Math.floor(this.items.length / this.itemsToShow);
      }
      this.itemsInCatalog = this.items.slice(quantity * this.itemsToShow, quantity * this.itemsToShow + this.itemsToShow);
      if (this.searchText.length > 0) {
        this.filteredItems = this.items.slice(quantity * this.itemsToShow, quantity * this.itemsToShow + this.itemsToShow);
        return this.items
      }
      return this.items
    }
    return this.currentPageQuantity;
  }

}
