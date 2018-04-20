const request = require("request");
const jquery = require("jquery");
let nightmare = require("nightmare");
const async = require("async");
const fs = require("fs");
const jimp = require("jimp");
const latinize = require("latinize");
const cheerio = require("cheerio");
const fse = require("fs-extra");
const load = require("download");
nightmare = nightmare();
let i = 0;
const mysql = require("mysql");
const cn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "samsung",
  database: "demo2"
});

cn.connect(err => {
  if (err) throw err;
  console.log("Connected");
});

const url = "https://www.w-t.az";
let names = ["phones", "computers", "numbers", "accessories", "smartwatches"];

let master = nightmare
  .goto(url)
  .wait(2000)
  .evaluate(() => {
    const navSelector = ".navbar-nav >li";
    let cat = [];
    let arr = $(navSelector).each(function(i, elem) {
      let arr = $(this)
        .find("a")
        .attr("href");
      cat.push(arr);
    });
    return cat;
  })
  .end()
  .then(function(result) {
    for (ar in result) {
      // console.log(url + result[ar]);
      let sql = "INSERT INTO categories (name, url) VALUES(?, ?)";
      // console.log(cat)
      cn.query(sql, [names[ar], result[ar]], function(err, result) {
        if (err) throw err;
        // console.log(result);
        // console.log("Records inserted");
      });
      cn.query(
        "DELETE n1 FROM categories n1, categories n2 WHERE n1.id > n2.id AND n1.name = n2.name"
      );
      return result;
    }
  })
  .then(function(result) {
    let caturl = result.map(r => url + r);
    // console.log(caturl);
    caturl.forEach(element => {
      request(element, function(err, res, body) {
        // console.log(row[i].url);

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
          // console.log(title);
          if (url !== undefined && price.length === 2) {
            let sql =
              "INSERT INTO products (name, url, nagd, nisye, catID) VALUES(?, ?, ?, ?, ?)  ON DUPLICATE KEY UPDATE name = name, url = url, nagd = nagd, nisye = nisye, catID = catID";
            cn.query(
              sql,
              [title, url, price[1], price[0], element.id],
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
            cn.query(sql, [title, url, price[0], element.id], function(
              err,
              result
            ) {
              if (err) throw err;
              cn.query(
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

                try {
                  cn.query("SELECT id FROM products", function(
                    err,
                    result,
                    fields
                  ) {
                    if (err) throw err;

                    for (let i = 0; i < result.length; i++) {
                      // console.log(result[i].id);
                      let minlik = parseInt(result[i].id / 1000 + 1) * 1000;
                      let yuzluk = parseInt(result[i].id / 100 + 1) * 100;
                      let onluq = parseInt(result[i].id / 10 + 1) * 10;
                      // console.log(yuzluk);
                      let dir = `/home/fuad/Desktop/muqaise/${minlik}/${yuzluk}/${onluq}/${
                        result[i].id
                      }`;
                      fse.ensureDir(dir)
                      	.then(() => {
                      		// console.log('success!')
                      	})
                      	.catch(err => {
                      		console.error(err)
					  	})
					  
					  let dist = `/home/fuad/Desktop/muqaise/${minlik}/${yuzluk}/${onluq}/${result[i].id}`
					  if(i>=result[i].id){
						console.log("err");
						
					}else{
						  	load(image,dist).then(() => {
                      		console.log('done!');
                      	}) .catch(err => {
							console.log(err);
						});
					}
					i++;
                    

                      /*  let sql = "INSERT INTO products (img) VALUES(?)";
												  connection.query(sql, image, function(err, result) {
													  if (err) throw err;
												  console.log(result);
												  console.log("Records inserted");
												  connection.query(
												  "DELETE n1 FROM products n1, products n2 WHERE n1.id > n2.id AND n1.name = n2.name"
												  );
											  });*/
                    }
				
		
			
                  });
                } catch (err) {
                  if (err) console.log("change the code cuz of ERROR");
                }
              }
            });
          }
        });
      });
    });
  });
