// const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const async = require("async");
const load = require("image-downloader");
const fs = require("fs");
const jimp = require("jimp");
const latinize = require("latinize");
const fdf = require("find-duplicate-files");
const fsx = require("fs-extra");
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
  connection.query('SELECT id FROM PRODUCTS',function(err, ids){
    ArrIds = [];
    for(i in ids){
      let id = ids[i].id;
      ArrIds.push(id);
      
    }
   
    // console.log(ArrIds);
    const kilofolders = Array.from(new Set(ArrIds.map(id => parseInt(((id / 1000)+1))*1000)));
    const subfolders = kilofolders.map(kilo => (ArrIds.filter(id => id <= kilo && id > kilo - 1000).map(id => id % 1000)));
    // console.log(subfolders)
    kilofolders.forEach((name, i)=>{
      
      fs.mkdir(`/Users/fuad/Code/WorkFunc/${name}`, (err)=>{
        if(!err){
          console.log("created parent folder", name);
          subfolders[i].forEach((id)=>{
            fs.mkdir(`/Users/fuad/Code/WorkFunc/${name}/${id}`, function(err){
              if(!err){
                console.log("created subfolder", id, "in", name);
              }
              return;
            });
          });
        }
        return;
      });
      
      console.log(name);
      return;
    });

 });
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
            let url =
              "www.w-t.az" +
              $(this)
                .find(".item_a")
                .attr("href");
            let price = $(this)
              .find(".product_buttons")
              .find("a")
              .text()
              .split(" ");
            let reg = function(val) {
              let myreg = /^\d+$/;
              return val.match(myreg);
            };
            //  console.log(title);
            price = price.filter(reg);
            //  console.log(price);

            if (url !== undefined && price.length === 2) {
              let sql =
                "INSERT INTO products (name, url, nagd, nisye, catID) VALUES(?, ?, ?, ?, ?)  ON DUPLICATE KEY UPDATE name = name, url = url, nagd = nagd, nisye = nisye, catID = catID";
              connection.query(
                sql,
                [title, url, price[1], price[0], row[i].id],
                function(err, result) {
                  if (err) throw err;
                  // console.log(result);
                  // console.log("Records inserted");
                  // connection.query(

                  // );
                }
              );
            } else if (title !== undefined && price.length === 1) {
              let sql =
                "INSERT INTO products (name, url, nagd, catID) VALUES(?,?,?,?)";
              connection.query(sql, [title, url, price[0], row[i].id], function(
                err,
                result
              ) {
                if (err) throw err;
                connection.query(
                  "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name"
                );
              });
            }
            if (url !== "www.w-t.azundefined") {
              
              // console.log(url);
              request("https://" + url, function(err, res, body) {
                if (!err && res.statusCode === 200) {
                  let $ = cheerio.load(body);
                  title = latinize(title);
                  let image = $('meta[property="og:image"]').attr("content");
                  // console.log(image);
                  connection.query('SELECT id FROM products',function(err, result, fields){
                    if(err) throw err;
                      let path = `/Users/fuad/Code/WorkFunc/${row.id}/${title}.jpeg`
                      console.log(result);
                    
                  })
               
                  // let options = {
                  //   url: image,
                  //   dest: `/Users/fuad/Code/WorkFunc//${title}.jpeg`
                  // };
                  // load
                  //   .image(options)
                  //   .then(({ filename, img }) => {
                  //     console.log("File saved to", filename);
                  //   })
                  //   .catch(err => {
                  //     throw err;
                  //   });
                    /*  let sql = "INSERT INTO products (img) VALUES(?)";
                      connection.query(sql, image, function(err, result) {
                        if (err) throw err;
                    // console.log(result);
                    // console.log("Records inserted");
                    connection.query(
                      "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name"
                    );
                  });*/
                }
              });
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
