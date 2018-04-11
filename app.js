const request = require("request");
const jquery = require('jquery');
let nightmare = require("nightmare");
const async = require('async');
const fs = require('fs');
const jimp = require('jimp');
const latinize = require('latinize');

nightmare = nightmare();


const mysql = require('mysql');
const cn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "samsung793",
	database: "demo2"
});

cn.connect((err)=>{
	if(err) throw err;
	console.log("Connected");
 });

const url = "https://www.w-t.az";
let names = ["phones", "computers", "numbers", "accessories", "smartwatches"];

let master = nightmare.goto(url)
.wait(2000)
.evaluate(()=>{
	const navSelector = ".navbar-nav >li";
	let cat = [];
	let arr = $(navSelector).each(function(i, elem) {
	  let arr = $(this)
		.find("a")
		.attr("href");
		cat.push(arr);
	})
return cat;
	

}).end().then(function(result){
	for(ar in result){
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
}).then(function(result){
	let caturl = result.map((r)=>url+r);
	console.log(caturl);
	caturl.forEach(element => {
		return nightmare.goto(element).evaluate((element)=>{
			return console.log("a");
		},element).then(function(){
			console.log("a");
		})
	});
});


