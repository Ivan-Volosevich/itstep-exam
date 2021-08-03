import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { CatalogItem } from './catalog';
import { ActivatedRoute } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';


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
  item!: any;

  // items: CatalogItem[] = [];
  // // item: CatalogItem | undefined;


  constructor(
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.catalogService.getAll().subscribe(items => this.items = items);
    // this.getAll();
    // this.getItem();
    this.catalogService.getAll().forEach(el => el.forEach(item => this.item = item));
    console.log('item: ', this.item);
  }

  // getAll(): void {
  //   this.catalogService.getAll()
  //     .subscribe(items => this.items = items);
  // }

  // getItem(): void {
    // console.log(this.item?.id)
    // const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    // this.catalogService.getItem(id)
    //   .subscribe(item => this.item = item)
  // }

  addItem() {
    this.items.unshift({id: (new Date()).getTime(), name: 'Product ' + (new Date()).getTime(), description: 'add desc', thumbnailUrl: this.items[this.items.length-1].thumbnailUrl});
  }

  deleteItem() {
    console.log('this.item.id', this.item.id)
    this.items = this.items.filter((el) => {
      console.log(el.id, this.item.id)
      return el.id !== this.item.id;
    })
  }

  onSearch() {
    if (this.searchText.length > 0) {
      this.filteredItems = this.items.filter((el: any) => {
        return el.name?.includes(this.searchText) || el.description?.includes(this.searchText);
      })
    }
  }

}
