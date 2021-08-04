import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { CatalogItem } from './catalog';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormControlName, FormGroup, FormGroupName } from '@angular/forms';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  catalogUrl = 'https://msbit-exam-products-store.firebaseio.com/products.json';
  items: CatalogItem[] = [];
  filteredItems: any;
  searchText = "";
  chosenItem: any;
  chosenItemId: any;
  productsLength!: number;
  productsPage!: number;

  productDetailsForm = new FormGroup({
    productImage: new FormControl,
    productName: new FormControl,
    productDescription: new FormControl,
    productPrice: new FormControl,
  })

  constructor(
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.catalogService.getAll().subscribe(items => {
      this.items = items;
      this.sorted();
      this.productsLength = this.items.length;
      console.log(this.productsLength)
    });

  }

  sorted() {
    return this.items.sort((a: any,b: any) => a.name > b.name ? 1 : -1);
  }

  sortByRecentlyAdded() {
    return this.items.sort((a: any,b: any) => a.name < b.name ? 1 : -1);
  }

  addItem() {
    this.items.unshift({
      creationDate: (new Date()).getTime(),
      description: 'add desc',
      id: (new Date()).getTime(),
      name: 'Product ' + (new Date()).getTime(),
      price: 0,
      thumbnailUrl: this.items[this.items.length-1].thumbnailUrl,
      url: this.items[this.items.length-1].thumbnailUrl,
    });
    console.log(this.items)
  }

  onItemClicked(item: any){
    this.chosenItem = item;
    this.chosenItemId = item.id;
    return this.chosenItem;
  }

  itemChosen() {
    this.chosenItem = this.items.filter((el) => {
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
    })
    return this.items;
  }

  onSearch() {
    console.log('search---', this.items)
    if (this.searchText.length > 0) {
      this.filteredItems = this.items.filter((el: any) => {
        return el.name?.includes(this.searchText) || el.description?.includes(this.searchText);
      })
    }
  }

  saveChangesOfProduct() {
    this.productDetailsForm.setValue(this.productDetailsForm.value);
    this.items = this.items.map(obj => {
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
    return this.productDetailsForm.value;
  }

}
