import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resturant } from '../Models/Resturant';
import { Product, ProductKeys } from '../Models/Product';
import { Addition } from '../Models/Addition';
import { from, map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api = `http://localhost:3000/api`;
  constructor(private http: HttpClient) {}

  getAdditionals(prodid: number | undefined) {
    if (prodid !== undefined) {
      return this.http.get<Addition[]>(`${this.api}/additionals/${prodid}`);
    }
    return new Observable<Addition[]>();
  }

  updateAdditionals(additionals: Addition[]) {
    let add = this.fixBooleanValuesAddi(additionals);
    console.log("🚀 ~ file: api.service.ts ~ line 23 ~ ApiService ~ updateAdditionals ~ add", add)
    return this.http.put<any>(`${this.api}/additionals`, { additionalsArray: add });
  }
  fixBooleanValuesAddi(additionals: Addition[]) {
    additionals.forEach((addition) => {
      console.log('istop ', addition.IsTop)
      addition.IsAvaliable = addition.IsAvaliable ? 1 : null;
      addition.IsMeal = addition.IsMeal ? 1 : null;
      addition.IsFirstMeal = addition.IsFirstMeal ? 1 : null;
      addition.IsFavorite = addition.IsFavorite ? 1 : null;
      addition.Checked = addition.Checked ? 1 : null;
      addition.IsSauce = addition.IsSauce ? 1 : null;
      addition.isLastMeal = addition.isLastMeal ? 1 : null;
      addition.extraAddition = addition.extraAddition ? 1 : null;
      addition.haveException = addition.haveException ? 1 : null;
      addition.IsTop = addition.IsTop ? '1' : '0';
      addition.isBread = addition.isBread ? 1 : null;
    });
    return additionals;
  }
  addProduct(selectedProduct: Product, resid: number) {
    this.fixBooleanValues(selectedProduct);
    return this.http.post<any>(`${this.api}/addProduct/${resid}`, selectedProduct);
  }
  getResturants() {
    return this.http.get<Resturant[]>(`${this.api}/resturants`);
  }

  getProducts(resid: number) {
    return this.http.get<any>(`${this.api}/products/${resid}`);
  }

  uploadImage(formData: FormData) {
    return this.http.post<any>(`${this.api}/upload`, formData);
  }
  saveProduct(product: Product) {
    this.fixBooleanValues(product);
    console.log('🚀 ~ file: api.service.ts ~ line 28 ~ ApiService ~ saveProduct ~ product', product);
    return this.http.put<any>(`${this.api}/products/${product.prodid}`, product);
  }
  getImages(){
    return this.http.get<any>(`${this.api}/images`);
  }
  fixBooleanValues(product: Product) {
    product.IsAvaliable = product.IsAvaliable ? 1 : 0;
    product.IsOneAddition = product.IsOneAddition ? 1 : 0;
    product.IsBus = product.IsBus ? 1 : 0;
    product.Ingredients = product.Ingredients ? 1 : 0;
    product.IsBurger = product.IsBurger ? '1' : '0';

    // product keys
  }
}
