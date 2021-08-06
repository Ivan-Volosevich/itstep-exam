import { Component, Inject, Input, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CatalogComponent } from '../catalog/catalog.component';

@Component({
  selector: 'app-popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.scss']
})
export class PopupSuccessComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {itemName: string}
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {}

}
