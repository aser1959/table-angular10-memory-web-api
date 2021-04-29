import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Animal } from '../models/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private animalsUrl = 'api/animals';

  constructor(
    private http: HttpClient
  ) {
  }

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.animalsUrl);
  }

  updateRowTable(animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(this.animalsUrl, animal);
  }

  addRowTable(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.animalsUrl, animal);
  }

  deleteRowTable(id: number): Observable<any> {
    return this.http.get<Animal>(`${this.animalsUrl}/${id}`);
  }

}
