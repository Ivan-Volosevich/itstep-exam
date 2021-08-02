import { Component, OnInit } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { CatalogItem } from './catalog';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  items: CatalogItem[] = [];
  item: CatalogItem | undefined;

  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.getAll();
    // this.getItem()
  }

  getAll(): void {
    this.catalogService.getAll()
      .subscribe(items => this.items = items);
  }

  // getItem(id: number): void {
  //   this.catalogService.getItem(id)
  //     .subscribe(item => this.item = item)
  // }

}
