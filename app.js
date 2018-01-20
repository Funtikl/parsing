var express = require('express');

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
// var mongoose = require('mongoose');
// var Mongo = require('mongodb').Mongo;

// var app = express();
// var port = 8000;
// mongoose.connect('mongodb://localhost:27017/scraper')
// mongoose.connection.on('error', function(){
// 	console.error('error');
// })
var url = 'https://www.w-t.az';
var links = [];
var cat = [];
var innerLink = [];

request(url, function (err, res, body) {
	if(!err && res.statusCode ===200){
		var $ = cheerio.load(body);
		$('.navbar-nav').each(function (i, elem) {
			//var category = $(this).find('li > a').attr('href'); bele etdikde sadece 1 link gelirdi.
			 var a = $(this).find('li > a').eq(0).attr('href');
			 var b = $(this).find('li > a').eq(1).attr('href');
			 var c = $(this).find('li > a').eq(2).attr('href');
			 var d = $(this).find('li > a').eq(3).attr('href');
			 var e = $(this).find('li > a').eq(4).attr('href');
			links.push(url + a);
			links.push(url + b);
			links.push(url + c);
			links.push(url + d);
			links.push(url + e);

		})
		console.log(links);
		// regular expression ilə filter
		function regEx(val){
			var myReg = /c/;
			return val.match(myReg);
		}
		cat = links.filter(regEx);
	

for (var i = 0; i < cat.length; i++) {
	request(cat[i], function (err, res, body){
	if(!err && res.statusCode===200){
		var $ = cheerio.load(body);
		$('.items').each(function(){
			var cont = $(this).find('.item_a').find('h2').text();
			innerLink.push({cont});
		})
		console.log(innerLink)
	}
})
}
		fs.writeFileSync('./category.json', JSON.stringify(cat, null , 4))
	}
} )

