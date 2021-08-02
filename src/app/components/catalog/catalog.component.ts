import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { CatalogItem } from './catalog';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  items: CatalogItem[] = [];
  item: CatalogItem | undefined;
  filteredItems: CatalogItem[] = [];
  searchText = "";

  constructor(
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.http.get('https://msbit-exam-products-store.firebaseio.com/products.json')
    .subscribe
    this.getItem();
  }

  getAll(): void {
    this.catalogService.getAll()
      .subscribe(items => this.items = items);
  }

  getItem(): void {
    // console.log(this.item?.id)
    // const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    // this.catalogService.getItem(id)
    //   .subscribe(item => this.item = item)
  }

  addItem() {
    this.items.push({id: (new Date()).getTime(), name: 'Product ' + (new Date()).getTime(), description: 'add desc', thumbnailUrl: this.items[this.items.length-1].thumbnailUrl});
  }

  deleteItem() {
    // this.items = this.items.filter((el) => {
    //   return this.items.id !== id;
    // })
  }

  onSearch() {
    if (this.searchText.length > 0) {
      this.filteredItems = this.items.filter((el) => {
        return el.name?.includes(this.searchText) || el.description?.includes(this.searchText);
      })
    }
    console.log(this.searchText);
  }

}
