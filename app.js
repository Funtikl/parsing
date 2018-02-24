const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const async = require('async');
const fs = require("fs");

const app = express();

//database




const mysql = require("mysql");
const phoneJson = require("./phones.json");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "samsung793",
  database: "prod"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected");
  // var sql =
  //   "INSERT INTO products (name , id, link) VALUES ('Iphone', '1', 'www.apple.com')";
  // connection.query(sql, function(err, result) {
  //   if (err) throw err;
  //   console.log("record inserted");
  // });
  // console.log("connected as id " + connection.threadId);
});
//database end






// url for pars
let url = "https://www.w-t.az";

// empty arrays for pushing parsed items
let links = [];
let cat = [];

//requset function from request pack to open url
request(url, function(err, res, body) {
  // if statement for catching errors and cheking connection
  if (!err && res.statusCode === 200) {
    //define variable for easy access to site body from cheerio
    let $ = cheerio.load(body);
    //select navbar-nav class from body and adding method each.
    $(".navbar-nav").each(function(i, elem) {
      // select li>a tag from this(class), find href attr and initialise it as variable
      let a = $(this)
        .find("li > a")
        .eq(0)
        .attr("href");
      let b = $(this)
        .find("li > a")
        .eq(1)
        .attr("href");
      let c = $(this)
        .find("li > a")
        .eq(2)
        .attr("href");
      let d = $(this)
        .find("li > a")
        .eq(3)
        .attr("href");
      let e = $(this)
        .find("li > a")
        .eq(4)
        .attr("href");
      // push all attrs to the empty links array
      links.push(url + a);
      links.push(url + b);
      links.push(url + c);
      links.push(url + d);
      links.push(url + e);
    });
    // console.log(links);
    // regular expression ilə filter
    function regEx(val) {
      let myReg = /c/;
      return val.match(myReg);
    }

    // assign links with regEx filter to cat
    cat = links.filter(regEx);

    //select first,second url of category(cat) and init it to vars phones'n'computers
   
    let [phones, computers, numbers, accessories, smartwatch] = cat;

    //define Pjson object with phones name to use after
    let Pjson = {
      
    };
    // open cat first url
    request(phones, function(err, res, body) {
      // check
      if (!err && res.statusCode === 200) {
        let $ = cheerio.load(body);

        // define title and price for using it in the cheerio to assing data
        // let title;
        let price = [];
        // select and filter item class
        $(".items div").filter(function() {
          // assign to data items class and map from toArray method images, titles links
          // let data = $(this); 
          let title = $(this).find('.item_a').attr('title');
          if(title !== undefined)
          {
            // console.log(title);
            let sql = "INSERT INTO `products` (`name`) VALUES ('"+title+"')";
                    
            connection.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result);
              console.log("Records inserted");
            });
          }

          
          // title = data.find("div").map(function(elem,i) {
          //  var x =  $(i).find(".item_a").attr("title");
          //       // $(x)[" www.w-t.az" + $(x).attr("href")]
          //   return x;
          //      }).get().join(', ');
           
      //  let sql = 'INSERT INTO `products` (`name`) VALUES ?';
                
      //   connection.query(sql,[title], function (err, result) {
      //     if (err) throw err;
      //     console.log(result);
      //     console.log("Records inserted");
      //   });
        });
  
        // console.log(Pjson);
        // use node method to take stringified Pjson and write it sync to phones.json
        // fs.writeFileSync("./phones.json", JSON.stringify(Pjson, null, 4));
      }
    });
    // open computers that was a cat second url
    request(computers, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        let $ = cheerio.load(body);

        let title;
        let json = {
          Computers: ""
        };

        $(".items").filter(function() {
          let data = $(this);
          title = data.children().find("a").toArray()
            .map(function(x) {
              return {
                name: data.children().find("img").attr("title"),
                link: " www.w-t.az" + $(x).attr("href"),
                price: ""
              };
            });

          json.Computers = title;
        });
        // console.log(json);

        // fs.writeFileSync("./comps.json", JSON.stringify(json, null, 4));
      }
      request(numbers, function(err, res, body) {
        if (!err && res.statusCode === 200) {
          let $ = cheerio.load(body);
          let title;
          let json = {
            numbers: ""
          };
          $(".numbers_list").each(function() {
            let data = $(this);
            let title = data
              .children()
              .next()
              .find("a")
              .toArray()
              .map(function(x) {
                return {
                  number: $(x).attr("title")
                };
              });
            json.numbers = title;
          });
          // console.log(json);
          // fs.writeFileSync("./numbers.txt", JSON.stringify(json, null, 4));
        }
      });
      request(accessories, function(err, res, body) {
        if (!err && res.statusCode === 200) {
          let $ = cheerio.load(body);
          let title;
          let json = {
            accessories: ""
          };
          $(".items").filter(function() {
            let data = $(this);
            title = data
              .children()
              .find("a")
              .toArray()
              .map(function(x) {
                return {
                  name: data
                    .children()
                    .find("img")
                    .attr("title"),
                  link: " www.w-t.az" + $(x).attr("href"),
                  price: ""
                };
              });

            json.accessories = title;
          });
          // console.log(json);
          // fs.writeFileSync("./accessories.json", JSON.stringify(json, null, 4));
        }
      });
      request(smartwatch , function(err,res,body){
        if(!err && res.statusCode === 200){
          let $ = cheerio.load(body);
          let title;
          let json = {
            smartwatch:""
          };
          $(".items").filter(function() {
            let data = $(this);
            title = data
              .children()
              .find("a")
              .toArray()
              .map(function(x) {
                return {
                  name: data
                    .children()
                    .find("img")
                    .attr("title"),
                  link: " www.w-t.az" + $(x).attr("href"),
                  price: ""
                };
              });

            json.smartwatch = title;
          });
          // console.log(json);
          // fs.writeFileSync("./smart.json", JSON.stringify(json, null, 4));
        }
      })
    });

    // fs.writeFileSync("./category.json", JSON.stringify({ cat }, null, 4));
  }
});

const port = 3000;
app.listen(port, ()=>{
  console.log('Server started on port' + port);
});