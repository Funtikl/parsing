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
		$('ul').each(function (i, elem) {
			var container = $(this).find('a').attr('href');
			links.push(url + container);
			
		})
		// regular expression ilə filter
		function regEx(val){
			var myReg = /c/;
			return val.match(myReg);
		}
		cat = links.filter(regEx);
		// console.log(cat);

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

