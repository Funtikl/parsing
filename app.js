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
        console.log(row[i].url);
        if (!err && res.statusCode === 200) {
          let $ = cheerio.load(body);
          $(".items div").each(function() {
            let title = $(this)
              .find(".item_a")
              .first()
              .attr("title");
            let url = $(this)
              .find(".item_a")
              .attr("href");
            if (title !== undefined) {
              console.log(url);
            }
          });
        }
      });
    }
  });
};
childrens();
// console.log(master);

// let master1 = function(linkTo){
//     request(linkTo, function(err, res, body){
//       if(!err && res.statusCode ===200){
//         let $ = cheerio.load(body);
//       $(".navbar-nav >li").each(function(i, elem){
//         let cat =  $(this).find("a").attr("href");
//         // console.log(cat);
//         let childrens = function(linkInTo){
//           for(let i = 0; i<linkInTo.length;i++){
//             request(linkInTo[i],function(err, res, body){
//               if(!err && res.statusCode === 200){
//                 $(".items div").each(function(){
//                   let title = $(this).find('.item_a').first().attr('title');
//                   let innerUrl =  $(this).find('.item_a').attr('href');
//                   let price = $(this).find('.product_buttons').find('a').text();
//                   let image = $(this).find('.item_a').attr('src');
//                   console.log(title);
//                 })
//               }
//              })
//           }

//           }
//         console.log(childrens(cat));
//            })

//         }
//     })
// }

master(url);

// const port = 3000;
// app.listen(port, ()=>{
//   console.log('Server started on port' + port);
// });
