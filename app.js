// const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const async = require("async");
// const app = express();

//database
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "samsung793",
  database: "demo"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected");
});

const url = "https://www.w-t.az";
let names = ["phones", "computers", "numbers", "accessories", "smartwatches"];
let master = function(linkTo) {
  request(linkTo, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      let $ = cheerio.load(body);
      $(".navbar-nav >li").each(function(i, elem) {
        let cat = $(this)
          .find("a")
          .attr("href");
        cat = url + cat;
        let sql = "INSERT INTO categories (name, url) VALUES(?, ?)";
        // console.log(cat)
        connection.query(sql, [names[i], cat], function(err, result) {
          if (err) throw err;
          // console.log(result);
          // console.log("Records inserted");
          connection.query(
            "DELETE n1 FROM categories n1, categories n2 WHERE n1.id > n2.id AND n1.name = n2.name"
          );
        });
      });
    }
  });
};
let childrens = function() {
  connection.query("SELECT * FROM categories", function(err, row, fields) {
    for (let i in row) {
      // console.log(row[i].url)
      request(row[i].url, function(err, res, body) {
        // console.log(row[i].url);
        if (!err && res.statusCode === 200) {
          let $ = cheerio.load(body);
          $(".items div").each(function() {
            let title = $(this)
              .find(".item_a")
              .first()
              .attr("title");
            let url = "www.w-t.az"+$(this)
              .find(".item_a")
              .attr("href");
              let price = $(this).find('.product_buttons').find('a').text().split(' ');
              let reg = function(val){
              let myreg =  /^\d+$/;
              return val.match(myreg);
             }
            //  console.log(title);
             price = price.filter(reg);
            //  console.log(price);
            
            if (title !== undefined && price.length===2) {
                let sql = "INSERT INTO products (name, url, nagd, nisye, catID) VALUES(?, ?, ?, ?, ?)";
                connection.query(sql, [title, url, price[1],price[0], row[i].id], function(err, result) {
                    if (err) throw err;
                // console.log(result);
                // console.log("Records inserted");
                connection.query(
                  "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name"
                );
              });
            }
            else if(title!== undefined && price.length===1){
              let sql = "INSERT INTO products (name, url, nagd, catID) VALUES(?,?,?,?)";
                connection.query(sql, [title, url,price[0],row[i].id], function(err, result) {
                    if (err) throw err;
                connection.query(
                  "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name"
                );
              });
            }
             

            
            else if(url!=="www.w-t.azundefined"){
              // console.log(url);
              request('https://'+url, function(err, res, body){
                if (!err && res.statusCode === 200) {
                  let $ = cheerio.load(body);

                    let image =  $('meta[property="og:image"]').attr('content');
                    console.log(image);
                    let sql = "INSERT INTO products (img) VALUES(?)";
                    connection.query(sql, image, function(err, result) {
                      if (err) throw err;
                  // console.log(result);
                  // console.log("Records inserted");
                  connection.query(
                    "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name"
                  );
                });
                    
                  }
                    })
             }
      
          });
        }
      });
    }
  });
};
childrens();
master(url);

// const port = 3000;
// app.listen(port, ()=>{
//   console.log('Server started on port' + port);
// });
