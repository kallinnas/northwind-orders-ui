import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Shipper } from '../models/shipper.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShipperService {

  private baseShipperURL = `${environment.baseURL}/Shippers`;

  employees$ = this.http.get<Shipper[]>(`${this.baseShipperURL}`);

  constructor(private http: HttpClient) { }
}
