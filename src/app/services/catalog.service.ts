import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CatalogComponent } from '../components/catalog/catalog.component';
import { CatalogItem } from '../components/catalog/catalog';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private catalogUrl = 'https://msbit-exam-products-store.firebaseio.com/products.json';

  constructor(
    private http: HttpClient,
  ) { }

  getAll(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(this.catalogUrl)
      .pipe(
        tap(_ => console.log('fetched items')),
        catchError(this.handleError<CatalogItem[]>('getAll', []))
      );
  }

  getItem(id: number): Observable<CatalogItem> {
    const url = '${this.catalogUrl}.${id}';
    return this.http.get<CatalogItem>(url).pipe(
      tap(_ => console.log(`fetched item id=${id}`)),
      catchError(this.handleError<CatalogItem>('getItem id=${id}'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
