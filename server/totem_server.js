//node express server with sql database

var express = require("express");
var app = express();
var cors = require("cors");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
var port = process.env.PORT || 3000;
var sql = require("mssql");
const config = {
  user: "sa",
  password: "1@Password",
  server: "localhost",
  database: "Totem",
  port: 1433,
};
app.use(cors());

//select all from table
app.get("/api/totem", function (req, res) {});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function (req, res) {
  query("select * from Categories").then((result) => {
    res.send(result.recordset);
  });
});

//get resturants
app.get("/api/resturants", function (req, res) {
  query("select * from Resturants").then((result) => {
    res.send(result.recordset);
  });
});
//get procucts by resturant
app.get("/api/products/:id", function (req, res) {
  let id = "";
  if (req.params.id == "1") {
    id = "1";
  } else if (req.params.id == "15") {
    id = "16";
  } else if (req.params.id == "14") {
    id = "17";
  }
  query(`select * from Products where CatID = '${id}'`).then((result) => {
    res.send(result.recordset);
  });
});
//get categories by resturant
app.get("/api/categories/:id", function (req, res) {
  let id = "";
  if (req.params.id == "") {
  }
  query(`select * from Categories where ResturantID = ${req.params.id}`).then(
    (result) => {
      res.send(result.recordset);
    }
  );
});
//add product
app.post("/api/addProduct/:id", function (req, res) {
  let CatID = "";
  if (req.params.id == "1") {
    CatID = "1";
  } else if (req.params.id == "15") {
    CatID = "16";
  } else if (req.params.id == "14") {
    CatID = "17";
  }

  let form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    let product = {
      prodid: fields.prodid,
      CatID: CatID,
      name: fields.name,
      pic: fields.pic,
      Price: fields.Price,
      Description: fields.Description,
      IsOneAddition: fields.IsOneAddition,
      IsBus: fields.IsBus,
      Ingredients: fields.Ingredients,
      IsAvaliable: fields.IsAvaliable,
      PopMessage: fields.PopMessage,
      Alias: fields.Alias,
      PopMessage2: fields.PopMessage2,
      numOfAdditions: fields.numOfAdditions,
      numOfSauce: fields.numOfSauce,
      numOfMeal: fields.numOfMeal,
      numOfFirstMeal: fields.numOfFirstMeal,
      numOfBread: fields.numOfBread,
      numOfExtra: fields.numOfExtra,
      additionMessage: fields.additionMessage,
      IsBurger: fields.IsBurger,
    };
    const qr = `insert into Products values ('${product.prodid}',
    '${product.CatID}',
    '${product.name?.replaceAll(`'`, `''`)}',
    '${product.pic ?? ""}',
    ${product.Price ?? 0},
    '${product.Description?.replaceAll(`'`, `''`) ?? ""}',
    ${product.IsOneAddition ?? null},
    ${product.IsBus ?? null},
    ${product.Ingredients ?? null},
    ${product.IsAvaliable ?? 1},
    ${normalizeText(product.PopMessage)},
    ${normalizeText(product.Alias)},
    ${normalizeText(product.PopMessage2)},
    ${product.numOfAdditions ?? null},
    ${product.numOfSauce ?? null},
    ${product.numOfMeal ?? null},
    ${product.numOfFirstMeal ?? null},
    ${product.numOfBread ?? null},
    ${product.numOfExtra ?? null},
    ${normalizeText(product.additionMessage)},
    ${product.IsBurger ?? "0"})`;
    console.log(qr);
    query(qr)
      .then((result) => {
        console.log("🚀 ~ file: totem_server.js ~ line 126 ~ result", result);
        res.send(result.recordset);
      })
      .catch((err) => {
        console.log("🚀 ~ file: totem_server.js ~ line 130 ~ err", err);
        res.send(err);
      });
  });
});
function normalizeText(msg) {
  // '${product.PopMessage?.replaceAll(`'`, `''`) ?? ""}'
  if (msg != undefined) {
    return `'${msg.replaceAll(`'`, `''`)}'`;
  } else {
    return null;
  }
}
// upload image
app.post("/api/upload", (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldPath = files.image.filepath;
    var newPath =
      path.join(__dirname, "pics") + "/" + files.image.originalFilename;
    var rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);
    });

    fs.writeFile(
      `C:\\xampp\\htdocs\\pics\\${files.image.originalFilename}`,
      rawData,
      function (err) {
        if (err) console.log(err);
        return res.send({
          code: 200,
          message: "success",
          name: files.image.originalFilename,
        });
      }
    );
    // C:\xampp\htdocs\pics
  });
});

// update product
app.put("/api/products/:id", function (req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const qr = `update Products set 
    name = ${normalizeText(fields.name)}, 
    pic = '${fields.pic}', 
    Price = '${fields.Price}', 
    Description = ${normalizeText(fields.Description)}, 
    IsOneAddition = '${fields.IsOneAddition}', 
    IsBus = '${fields.IsBus}', 
    Ingredients = '${fields.Ingredients}', 
    IsAvaliable = '${fields.IsAvaliable}', 
    PopMessage = ${normalizeText(fields.PopMessage)}, 
    Alias = ${normalizeText(fields.Alias)}, 
    PopMessage2 = ${normalizeText(fields.PopMessage2)}, 
    numOfAdditions = ${fields.numOfAdditions ?? null}, 
    numOfSauce = ${fields.numOfSauce ?? null}, 
    numOfMeal = ${fields.numOfMeal ?? null}, 
    numOfFirstMeal = ${fields.numOfFirstMeal ?? null}, 
    numOfBread = ${fields.numOfBread ?? null}, 
    numOfExtra = ${fields.numOfExtra ?? null}, 
    additionMessage = ${normalizeText(fields.additionMessage)}, 
    IsBurger = '${fields.IsBurger}' where prodid = '${req.params.id}'`;
    query(qr)
      .then((result) => {
        res.send(result.recordset);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
//get additions by prodid
app.get("/api/additionals/:id", function (req, res) {
  const qr = `select * from additionals where prodid = '${req.params.id}'`;
  query(qr)
    .then((result) => {
      res.send(result.recordset);
    })
    .catch((err) => {
      console.log(err);
    });
});
const addition = {
  addition: 255,
  prodid: "45",
  name: "בלי צילי חריף",
  IsMeal: null,
  IsFirstMeal: null,
  NumberOfChoices: null,
  Image: "hot-pepper.png",
  IsFavorite: 1,
  IsAvaliable: 1,
  Style: null,
  Checked: null,
  IsSauce: null,
  isLastMeal: null,
  isBread: null,
  extraAddition: null,
  additionMessage: null,
  haveException: null,
  isPowerBread: null,
  AdditionBlock: null,
  IsTop: null,
};
// update list of additions
app.put("/api/additionals/", function (req, res) {
  console.log("here");
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let queries = [];
    // array of additionals
    const additionalsArray = fields.additionalsArray;
    console.log(
      "🚀 ~ file: totem_server.js ~ line 249 ~ additionalsArray",
      additionalsArray
    );
    // update additionals table
    additionalsArray.forEach((addition) => {
      if (addition.new == true) {
        const qr = `insert into additionals (addition ,prodid,
          name,
          IsMeal,
          IsFirstMeal,
          NumberOfChoices,
          Image,
          IsFavorite,
          IsAvaliable,
          Style,
          Checked,
          IsSauce,
          isLastMeal,
          isBread,
          extraAddition,
          additionMessage,
          haveException,
          isPowerBread,
          AdditionBlock,
          IsTop) values (${addition.addition},'${addition.prodid}',
          '${addition.name}',
          ${addition.IsMeal || null},
          ${addition.IsFirstMeal || null},
          ${addition.NumberOfChoices || null},
          ${getImage(addition.Image)},  
          ${addition.IsFavorite ?? null},
          ${addition.IsAvaliable || null},
          '${addition.Style}',
          ${addition.Checked || null} ,
          ${addition.IsSauce || null},
          ${addition.isLastMeal || null},
          ${addition.isBread || null},
          ${addition.extraAddition || null},
          '${addition.additionMessage ?? null}',
          ${addition.haveException || null},
          '${addition.isPowerBread || null}',
          '${addition.AdditionBlock || null}',
          '${addition.IsTop || null}')`;
        console.log(qr);
        queries.push(query(qr));
      } else {
        const qr = `update additionals set 
        name = '${addition.name?.replaceAll(`'`, `''`)}', 
      IsMeal = ${addition.IsMeal ?? null} , 
      IsFirstMeal = ${addition.IsFirstMeal ?? null}, 
      NumberOfChoices = ${addition.NumberOfChoices ?? null}, 
      Image = ${getImage(addition.Image)}, 
      IsFavorite = ${addition.IsFavorite ?? null}, 
      IsAvaliable = ${addition.IsAvaliable ?? null}, 
      Style = '${addition.Style ?? null}', 
      Checked = ${addition.Checked ?? null}, 
      IsSauce = ${addition.IsSauce ?? null}, 
      isLastMeal = ${addition.isLastMeal ?? null}, 
      isBread = ${addition.isBread ?? null}, 
      extraAddition = ${addition.extraAddition ?? null}, 
      additionMessage = '${addition.additionMessage?.replaceAll(`'`, `''`)}', 
      haveException = ${addition.haveException ?? null}, 
      isPowerBread = '${addition.isPowerBread ?? null}', 
      AdditionBlock = '${addition.AdditionBlock ?? null}', 
      IsTop = '${addition.IsTop ?? null}' where addition = '${
          addition.addition
        }'`;
        queries.push(query(qr));
        console.log(
          "🚀 ~ file: totem_server.js ~ line 294 ~ additionalsArray.forEach ~ qr",
          addition.name,
          qr
        );
      }
    });

    Promise.allSettled(queries)
      .then((results) => {
        res.send(results);
      })
      .catch((err) => {
        console.log(err);
        res.send({
          code: 500,
          message: "error",
        });
      });
  });
});
app.get("/api/images/", async function (req, res) {
  const imageList = await getImageFilesNames();
  res.send(imageList);
});
// get list of files
function getImageFilesNames() {
  return new Promise((resolve, reject) => {
    // c drive
    const cDrive = "C:\\Users\\Samer\\Desktop\\totem_manager\\assets\\pics";
    // get list of files
    const files = fs.readdirSync(cDrive);
    // get list of files names
    const filesNames = files.map((file) => {
      return file;
    });
    resolve(filesNames);
  });
}
function getImage(img) {
  if (img == null || img == undefined) {
    return `'placeholder.png'`;
  }
  return `'${img}'`;
}
// sql query
function query(query) {
  return new sql.ConnectionPool(config).connect().then((pool) => {
    return pool.request().query(query);
  });
}

// rand between 1000 and 99999
function randomNumber() {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}
app.listen(port, function () {
  console.log("Server is running... : " + port);
});
