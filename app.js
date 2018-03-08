// const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const async = require('async');
const fs = require("fs");
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
    cat = links.filter(regEx);
//insert to database;

    //select first,second url of category(cat) and init it to vars phones'n'computers

    let [phones, computers, numbers, accessories, smartwatches] = cat;
    let names = ["phones", "computers", "numbers", "accessories", "smartwatches"];

    for (let i=0; i<names.length; i++){
      cat[i] = cat[i].split(', ');
      let sql = 'INSERT INTO categories (name, url) VALUES(?, ?)';
connection.query(sql, [names[i], cat[i]], function(err,  result) {
        if (err) throw err;
        // console.log(result);
        // console.log("Records inserted");
    });
    connection.query( "DELETE n1 FROM categories n1, categories n2 WHERE n1.id > n2.id AND n1.name = n2.name");
    }
    request(phones, function(err, res, body) {
      // check
      if (!err && res.statusCode === 200) {
        let $ = cheerio.load(body);
               // select and filter item class
        $(".items div").each(function() {
          let title = $(this).find('.item_a').first().attr('title');
          let url =  $(this).find('.item_a').attr('href');
          let priceButton = $(this).find('.product_buttons').text();
          // console.log(title)
          priceButton = priceButton.split(' ');
          // console.log(priceButton);
          if(priceButton.length===5){
           let price1 = 'INSERT INTO products (nisye, nagd) VALUES(?, ?)';
           connection.query(price1, [priceButton[1],priceButton[3]],function(err,result){
             if(err) throw err;
            //  console.log(result);
           });
          }
          else if(priceButton===3){
            let price2 = 'INSERT INTO products (nisye, nagd) VALUES(?, ?)';
            connection.query(price2, [priceButton[1], ''],function(err,result){
              if(err) throw err;
              // console.log(result);
            }
            )}
          // let image = $(this).find('.item_a').attr('src');
           
            let sql = 'INSERT INTO products (name, url) VALUES(?, ?)';
            if(title!==undefined){  
          connection.query(sql, [title, "www.w-t.az"+url], function(err,  result) {

            if (err) throw err;
            console.log(result);
            console.log("Records inserted");

          });}
         
            connection.query("delete from products where name = '';");
            connection.query( "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name");
      });
      }
    });
    // open computers that was a cat second url
    request(computers, function(err, res, body) {
      if (!err && res.statusCode === 200) {
        let $ = cheerio.load(body);
           $(".items div").filter(function() {
          let title = $(this).find('.item_a').find('h2').text();
          let url =  $(this).find('.item_a').attr('href');
          let priceButton = $(this).find('.product_buttons').text();
          priceButton = priceButton.split(' ');
        //  console.log(priceButton);

         if(priceButton.length===5){
           let price1 = 'INSERT INTO products (nagd, nisye) VALUES(?, ?)';
           connection.query(price1, [priceButton[1],priceButton[3]],function(err,result){
             if(err) throw err;
            //  console.log(result);
           })
          }
        else if(priceButton===3){
            let price2 = 'INSERT INTO products (nagd, nisye) VALUES(?, ?)';
            connection.query(price2, [priceButton[1], ''],function(err,result){
              if(err) throw err;
              // console.log(result);
            }
            )}
          // console.log(title);
          let sql = 'INSERT INTO products (name, url) VALUES(?, ?)';
          connection.query(sql, [title, "www.w-t.az"+url], function(err,  result) {

            if (err) throw err;
            // console.log(result);
            // console.log("Records inserted");

          });
          });
         }
      connection.query("delete from products where name = '';");
      connection.query( "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name");

    request(smartwatches , function(err,res,body){
        if(!err && res.statusCode === 200){
          let $ = cheerio.load(body);
          $(".items div").filter(function() {
            let title = $(this).find('.item_a').find('h2').text();
            let url =  $(this).find('.item_a').attr('href');
            let priceButton = $(this).find('.product_buttons').text();
          priceButton = priceButton.split(' ');
        //  console.log(priceButton);

         if(priceButton.length===5){
           let price1 = 'INSERT INTO products (nagd, nisye) VALUES(?, ?)';
           connection.query(price1, [priceButton[1],priceButton[3]],function(err,result){
             if(err) throw err;
            //  console.log(result);
           })
          }
        else if(priceButton===3){
            let price2 = 'INSERT INTO products (nagd, nisye) VALUES(?, ?)';
            connection.query(price2, [priceButton[1], ''],function(err,result){
              if(err) throw err;
              // console.log(result);
            }
            )}
            // console.log(title);
            let sql = 'INSERT INTO products (name, url) VALUES(?, ?)';
          connection.query(sql, [title, "www.w-t.az"+url], function(err,  result) {

            if (err) throw err;
            // console.log(result);
            // console.log("Records inserted");

          });
        });
          connection.query("delete from products where name = '';");
          connection.query( "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name");
        }

      })
      // request(numbers, function(err, res, body){
      //   if(!err && res.statusCode===200){
      //     let $ = cheerio.load(body);
      //     $(".container").filter(function(){
      //       let number = $(this).find('strong').text();
      //       setTimeout(function(){console.log(number.split([' ),']))}, 3000);
      //     });
      //   }
      // })
    });

  }

});

// const port = 3000;
// app.listen(port, ()=>{
//   console.log('Server started on port' + port);
// });
