export class Product {
  prodid?: number ;
  CatID: string = '';
  name: string = '';
  pic?: string;
  Price: number = 0;
  Description: string = '';
  IsOneAddition?: number;
  IsBus?: number;
  Ingredients?: number;
  IsAvaliable?: number;
  PopMessage?: string;
  Alias?: string;
  PopMessage2?: string;
  numOfAdditions?: number;
  numOfSauce?: number;
  numOfMeal?: number;
  numOfFirstMeal?: number;
  numOfBread?: number;
  numOfExtra?: number;
  additionMessage?: string;
  IsBurger?: string;
}


export class ProductKeys {
    static prodid: string = "prodid";
    static CatID: string = "CatID";
    static name_: string = "name";
    static pic: string = "pic";
    static Price: string = "Price";
    static Description: string = "Description";
    static IsOneAddition: string = "IsOneAddition";
    static IsBus: string = "IsBus";
    static Ingredients: string = "Ingredients";
    static IsAvaliable: string = "IsAvaliable";
    static PopMessage: string = "PopMessage";
    static Alias: string = "Alias";
    static PopMessage2: string = "PopMessage2";
    static numOfAdditions: string = "numOfAdditions";
    static numOfSauce: string = "numOfSauce";
    static numOfMeal: string = "numOfMeal";
    static numOfFirstMeal: string = "numOfFirstMeal";
    static numOfBread: string = "numOfBread";
    static numOfExtra: string = "numOfExtra";
    static additionMessage: string = "additionMessage";
    static IsBurger: string = "IsBurger";
}