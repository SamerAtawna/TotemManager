import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Addition } from 'src/app/Models/Addition';
import { Product } from 'src/app/Models/Product';
import { ApiService } from 'src/app/Services/api.service';
import { Resturant } from './../../Models/Resturant';
import { ADDITION_MULTIPLE, BUSINESS_ADDITION_MAIN, BUSINESS_FIRST_MEAL, BUSINESS_LAST_MEAL, FAVORITES_MULTIPLE, ONE_RADIO, SAUCE_MULTIPLE } from './constants';
@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss'],
})
export class FoodComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  resturants: Resturant[] = [];
  activeRest: number = 15;
  menuItems: Product[] = [];
  loadingProducts: boolean = false;
  selectedProduct: Product | null = null;
  additionals: Addition[] = [];
  activeAdditiontemplate: number | null = null;
  additionImages: string[] = [];
  activeAdditionImage: number = 0;
  constructor(private api: ApiService, private toastr: ToastrService) {
    this.api.getResturants().subscribe((data) => {
      this.resturants = data;
    });
    this.getProducts();
  }

  ngOnInit(): void {
    this.getImages();
  }

  setResturant(id: number) {
    this.activeRest = id;
    this.getProducts();
  }
  getProducts() {
    this.loadingProducts = true;
    this.api.getProducts(this.activeRest).subscribe((data) => {
      console.log(data);
      this.menuItems = data;
      this.loadingProducts = false;
    });
  }
  setAdditionImage(image: string) {
    debugger
    const add = this.additionals.find((el) => el.addition === this.activeAdditionImage);
    if (add != null) {
      add.Image = image;
    }
  }

  setProduct(product: Product) {
    this.selectedProduct = product;
    this.getAdditionals();
  }
  activeAddImage(id: number) {
    this.activeAdditionImage = id;
  }

  uploadImage(product: Product) {
    const uploadedImage = this.fileInput.nativeElement.files[0];
    if (uploadedImage != undefined) {
      const formData = new FormData();
      formData.append('image', uploadedImage);
      this.api.uploadImage(formData).subscribe((data) => {
        product.pic = data.name;
      });
    }
  }
  fileDialog() {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }
  newAddition() {
    if (this.selectedProduct !== null) {
      debugger;
      let addition = new Addition();
      addition.prodid = this.selectedProduct.prodid?.toString() ?? '';
      addition.addition = this.randomNumber();
      addition.new = true;
      this.additionals.unshift(addition);
    }
  }
  // random number 1000 to 99999
  randomNumber() {
    return Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;
  }
  saveProduct() {
    console.log('asd ', this.additionals);
    if (this.selectedProduct != null) {
      if (this.selectedProduct.prodid !== undefined) {
        this.api.saveProduct(this.selectedProduct).subscribe({
          next: (data) => {
            this.toastr.success('מנה עודכנה בהצלחה', 'הצלחה');
            console.log(data);
            this.saveAdditionals();
            this.getProducts();
          },
          error: (err) => {
            this.toastr.error('שגיאה בשמירת מנה', 'שגיאה');
            console.log(err);
          },
        });
        // save additions
        if (this.additionals.length > 0) {
        }
      } else {
        this.selectedProduct.prodid = this.randomNumber();
        this.api.addProduct(this.selectedProduct, this.activeRest).subscribe({
          next: (data) => {
            console.log(data);
            this.saveAdditionals();
            this.getProducts();
          },
          error: (err) => {
            console.log(err);
            this.toastr.error('שגיאה בהוספת מנה', 'שגיאה');
          },
        });
      }
    }
  }

  private saveAdditionals() {
    this.additionals.forEach((el) => {
      el.prodid = this.selectedProduct?.prodid?.toString() ?? '';
    });
    this.api.updateAdditionals(this.additionals).subscribe({
      next: (data) => {
        this.toastr.success('התוספות עודכנו בהצלחה', 'הצלחה');
        console.log(data);
        this.getAdditionals();
      },
      error: (err) => {
        this.toastr.error('התוספות לא עודכנו', 'שגיאה');
        console.log(err);
      },
    });
  }
  activeAdditionTemp(id: number) {
    this.activeAdditiontemplate = id;
  }
  setTemplate(template: string) {
    debugger;
    const addition = this.additionals.find((el) => el.addition === this.activeAdditiontemplate);
    switch (template) {
      case 'business-addition-main':
        if (addition != undefined) {
          addition.IsMeal = BUSINESS_ADDITION_MAIN.IsMeal;
          addition.IsFirstMeal = BUSINESS_ADDITION_MAIN.IsFirstMeal;
          addition.NumberOfChoices = BUSINESS_ADDITION_MAIN.NumberOfChoices;
          addition.IsFavorite = BUSINESS_ADDITION_MAIN.IsFavorite;
          addition.IsAvaliable = BUSINESS_ADDITION_MAIN.IsAvaliable;
          addition.Checked = BUSINESS_ADDITION_MAIN.Checked;
          addition.IsSauce = BUSINESS_ADDITION_MAIN.IsSauce;
          addition.isLastMeal = BUSINESS_ADDITION_MAIN.isLastMeal;
          addition.isBread = BUSINESS_ADDITION_MAIN.isBread;
          addition.extraAddition = BUSINESS_ADDITION_MAIN.extraAddition;
          addition.IsTop = BUSINESS_ADDITION_MAIN.IsTop;
          addition.haveException = BUSINESS_ADDITION_MAIN.haveException;
        }
        break;
      case 'addition-multiple':
        if (addition != undefined) {
          addition.IsMeal = ADDITION_MULTIPLE.IsMeal;
          addition.IsFirstMeal = ADDITION_MULTIPLE.IsFirstMeal;
          addition.NumberOfChoices = ADDITION_MULTIPLE.NumberOfChoices;
          addition.IsFavorite = ADDITION_MULTIPLE.IsFavorite;
          addition.IsAvaliable = ADDITION_MULTIPLE.IsAvaliable;
          addition.Checked = ADDITION_MULTIPLE.Checked;
          addition.IsSauce = ADDITION_MULTIPLE.IsSauce;
          addition.isLastMeal = ADDITION_MULTIPLE.isLastMeal;
          addition.isBread = ADDITION_MULTIPLE.isBread;
          addition.extraAddition = ADDITION_MULTIPLE.extraAddition;
          addition.IsTop = ADDITION_MULTIPLE.IsTop;
          addition.haveException = ADDITION_MULTIPLE.haveException;
        }
        break;
      case 'business-first-meal':
        if (addition != undefined) {
          addition.IsMeal = BUSINESS_FIRST_MEAL.IsMeal;
          addition.IsFirstMeal = BUSINESS_FIRST_MEAL.IsFirstMeal;
          addition.NumberOfChoices = BUSINESS_FIRST_MEAL.NumberOfChoices;
          addition.IsFavorite = BUSINESS_FIRST_MEAL.IsFavorite;
          addition.IsAvaliable = BUSINESS_FIRST_MEAL.IsAvaliable;
          addition.Checked = BUSINESS_FIRST_MEAL.Checked;
          addition.IsSauce = BUSINESS_FIRST_MEAL.IsSauce;
          addition.isLastMeal = BUSINESS_FIRST_MEAL.isLastMeal;
          addition.isBread = BUSINESS_FIRST_MEAL.isBread;
          addition.extraAddition = BUSINESS_FIRST_MEAL.extraAddition;
          addition.IsTop = BUSINESS_FIRST_MEAL.IsTop;
          addition.haveException = BUSINESS_FIRST_MEAL.haveException;
        }
        break;
      case 'business-last-addition':
        if (addition != undefined) {
          addition.IsMeal = BUSINESS_LAST_MEAL.IsMeal;
          addition.IsFirstMeal = BUSINESS_LAST_MEAL.IsFirstMeal;
          addition.NumberOfChoices = BUSINESS_LAST_MEAL.NumberOfChoices;
          addition.IsFavorite = BUSINESS_LAST_MEAL.IsFavorite;
          addition.IsAvaliable = BUSINESS_LAST_MEAL.IsAvaliable;
          addition.Checked = BUSINESS_LAST_MEAL.Checked;
          addition.IsSauce = BUSINESS_LAST_MEAL.IsSauce;
          addition.isLastMeal = BUSINESS_LAST_MEAL.isLastMeal;
          addition.isBread = BUSINESS_LAST_MEAL.isBread;
          addition.extraAddition = BUSINESS_LAST_MEAL.extraAddition;
          addition.IsTop = BUSINESS_LAST_MEAL.IsTop;
          addition.haveException = BUSINESS_LAST_MEAL.haveException;
        }
        break;
      case 'favorites-multiple':
        if (addition != undefined) {
          addition.IsMeal = FAVORITES_MULTIPLE.IsMeal;
          addition.IsFirstMeal = FAVORITES_MULTIPLE.IsFirstMeal;
          addition.NumberOfChoices = FAVORITES_MULTIPLE.NumberOfChoices;
          addition.IsFavorite = FAVORITES_MULTIPLE.IsFavorite;
          addition.IsAvaliable = FAVORITES_MULTIPLE.IsAvaliable;
          addition.Checked = FAVORITES_MULTIPLE.Checked;
          addition.IsSauce = FAVORITES_MULTIPLE.IsSauce;
          addition.isLastMeal = FAVORITES_MULTIPLE.isLastMeal;
          addition.isBread = FAVORITES_MULTIPLE.isBread;
          addition.extraAddition = FAVORITES_MULTIPLE.extraAddition;
          addition.IsTop = FAVORITES_MULTIPLE.IsTop;
          addition.haveException = FAVORITES_MULTIPLE.haveException;
        }
        break;
      case 'template-one-radio':
        if (addition != undefined) {
          addition.IsMeal = ONE_RADIO.IsMeal;
          addition.IsFirstMeal = ONE_RADIO.IsFirstMeal;
          addition.NumberOfChoices = ONE_RADIO.NumberOfChoices;
          addition.IsFavorite = ONE_RADIO.IsFavorite;
          addition.IsAvaliable = ONE_RADIO.IsAvaliable;
          addition.Checked = ONE_RADIO.Checked;
          addition.IsSauce = ONE_RADIO.IsSauce;
          addition.isLastMeal = ONE_RADIO.isLastMeal;
          addition.isBread = ONE_RADIO.isBread;
          addition.extraAddition = ONE_RADIO.extraAddition;
          addition.IsTop = ONE_RADIO.IsTop;
          addition.haveException = ONE_RADIO.haveException;
        }
        break;
      case 'sauce-multiple':
        if (addition != undefined) {
          addition.IsMeal = SAUCE_MULTIPLE.IsMeal;
          addition.IsFirstMeal = SAUCE_MULTIPLE.IsFirstMeal;
          addition.NumberOfChoices = SAUCE_MULTIPLE.NumberOfChoices;
          addition.IsFavorite = SAUCE_MULTIPLE.IsFavorite;
          addition.IsAvaliable = SAUCE_MULTIPLE.IsAvaliable;
          addition.Checked = SAUCE_MULTIPLE.Checked;
          addition.IsSauce = SAUCE_MULTIPLE.IsSauce;
          addition.isLastMeal = SAUCE_MULTIPLE.isLastMeal;
          addition.isBread = SAUCE_MULTIPLE.isBread;
          addition.extraAddition = SAUCE_MULTIPLE.extraAddition;
          addition.IsTop = SAUCE_MULTIPLE.IsTop;
          addition.haveException = SAUCE_MULTIPLE.haveException;
        }
        break;
    }
  }
  getAdditionals() {
    if (this.selectedProduct) {
      this.api
        .getAdditionals(this.selectedProduct.prodid)
        .pipe(
          map((x) => {
            return x.map((y) => {
              return {
                AdditionBlock: y.AdditionBlock,
                Checked: y.Checked === 1 ? true : false,
                Image: y.Image,
                IsAvaliable: y.IsAvaliable === 1 ? true : false,
                IsFavorite: y.IsFavorite === 1 ? true : false,
                IsFirstMeal: y.IsFirstMeal === 1 ? true : false,
                IsMeal: y.IsMeal === 1 ? true : false,
                IsSauce: y.IsSauce === 1 ? true : false,
                IsTop: y.IsTop == '1' ? true : false,
                NumberOfChoices: y.NumberOfChoices,
                Style: y.Style,
                addition: y.addition,
                additionMessage: y.additionMessage,
                extraAddition: y.extraAddition === 1 ? true : false,
                haveException: y.haveException === 1 ? true : false,
                isBread: y.isBread === 1 ? true : false,
                isLastMeal: y.isLastMeal === 1 ? true : false,
                isPowerBread: y.isPowerBread,
                name: y.name,
                prodid: y.prodid,
              };
            });
          })
        )
        .subscribe((data) => {
          console.log('🚀 ~ file: food.component.ts ~ line 153 ~ FoodComponent ~ .subscribe ~ data', data);
          this.additionals = data;
        });
    }
  }
  getImages() {
    this.api.getImages().subscribe((res) => {
      this.additionImages = res.filter((img: string) => {
        return img.split('.').pop() !== 'pdf';
      });
    });
  }
  newProduct() {
    this.selectedProduct = new Product();
    this.additionals = [];
  }
}
