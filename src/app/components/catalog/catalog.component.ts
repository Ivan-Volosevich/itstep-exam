import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { CatalogItem } from './catalog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  items: CatalogItem[] = [];
  item: CatalogItem | undefined;

  constructor(
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.getAll();
    this.getItem();
  }

  getAll(): void {
    this.catalogService.getAll()
      .subscribe(items => this.items = items);
  }

  getItem(): void {
    console.log(this.item?.id)
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.catalogService.getItem(id)
      .subscribe(item => this.item = item)
  }

  addItem() {
    this.items.push({id: (new Date()).getTime(), name: 'Product ' + (new Date()).getTime(), description: 'add desc', thumbnailUrl: this.items[this.items.length-1].thumbnailUrl});
  }

  deleteItem() {
    // const delBtn = attributes['data-deletebtn'].value;
    // console.log(delBtn);
  }

}
