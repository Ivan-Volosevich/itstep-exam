import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { CatalogComponent } from '../catalog/catalog.component';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges{
  currentPage = 0;
  totalPages = 1;

  @Input() itemsArr: any[] = [];
  @Input() paginationStep: number = 4;
  @Output() changePage = new EventEmitter();

  ngOnChanges() {
    this.changePage.emit(this.currentPage);
    console.log('from pag ', this.currentPage)
    this.totalPages = Math.ceil(this.itemsArr.length / this.paginationStep);

    console.log(this.totalPages)
  }

  prevPage() {
    this.ngOnChanges();
    if (this.currentPage > 0) {
      this.currentPage--;
      this.changePage.emit(this.currentPage);
    }
  }

  nextPage() {
    this.ngOnChanges();
    if (this.totalPages > this.currentPage + 1) {
      console.log('next', this.itemsArr)
      this.currentPage++;
      this.changePage.emit(this.currentPage)
    }
  }
}
