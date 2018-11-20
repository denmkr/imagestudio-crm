import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class WarehouseService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getProducts(search) {
    let httpParams = new HttpParams();
    if (search != null && search != undefined) { httpParams = httpParams.set('q', search); }

    return this.http.get<any>("http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/products/", { params: httpParams })
    .map(result => {
      return result.products.map(product => ({
        id: product.id,
        name: product.name
      }));
    });
  }

  createProduct(name: string) {
    const product = {
      name: name
    };

    return this.http.post<any>('http://imagestudio-crm-backend-qa.herokuapp.com/api/v1/products/', product).map(
      result => { return result.product }
    );
  }

}
