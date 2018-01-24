const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
// let mongoose = require('mongoose');
// let Mongo = require('mongodb').Mongo;

// let app = express();
// let port = 8000;
// mongoose.connect('mongodb://localhost:27017/scraper')
// mongoose.connection.on('error', function(){
// 	console.error('error');
// })
let url = 'https://www.w-t.az';
let links = [];
let cat = [];

request(url, function (err, res, body) {
	if (!err && res.statusCode === 200) {
		let $ = cheerio.load(body);
		$('.navbar-nav').each(function (i, elem) {
			//let category = $(this).find('li > a').attr('href'); bele etdikde sadece 1 link gelirdi.
			let a = $(this).find('li > a').eq(0).attr('href');
			let b = $(this).find('li > a').eq(1).attr('href');
			let c = $(this).find('li > a').eq(2).attr('href');
			let d = $(this).find('li > a').eq(3).attr('href');
			let e = $(this).find('li > a').eq(4).attr('href');
			links.push(url + a);
			links.push(url + b);
			links.push(url + c);
			links.push(url + d);
			links.push(url + e);

		})
		// console.log(links);
		// regular expression ilə filter
		function regEx(val) {
			let myReg = /c/;
			return val.match(myReg);
		}
		cat = links.filter(regEx);

		let phones = cat[0];
		let computers = cat[1];

// yeni elaveler - bashlangic
		let Pjson = {
			Phones: ""
		}
		request(phones, function (err, res, body) {
			if (!err && res.statusCode === 200) {
				let $ = cheerio.load(body);
				let count = $('.items').children().toArray().map(function (x) {
					return $(x).find('a').attr('href');
				});


				let title, price;
				let json = {
					Computers: ""
				}
			
				$('.items').filter(function () {
					let data = $(this);
					title = data.children().find('a').toArray().map(function (x) {
						return {
							name: data.children().find('img').attr('title'),
							link: " www.w-t.az" + $(x).attr('href'),
							price: ""
						};
					})

					Pjson.Phones = title;


				})
				// console.log(Pjson);

				fs.writeFileSync('./phones.json', JSON.stringify(Pjson, null, 4))
			}
		})
		request(computers, function (err, res, body) {
			if (!err && res.statusCode === 200) {
				let $ = cheerio.load(body);
				let count = $('.items').children().toArray().map(function (x) {
					return $(x).find('a').attr('href');
				});


				let title;
				let json = {
					Computers: ""
				}
				
				$('.items').filter(function () {
					let data = $(this);

					title = data.children().find('a').toArray().map(function (x) {
						return {
							name: data.children().find('img').attr('title'),
							link: " www.w-t.az" + $(x).attr('href'),
							price: ""
						};
					})

					json.Computers = title;


				})
				// console.log(json);

				fs.writeFileSync('./comps.json', JSON.stringify(json, null, 4))
			}
		})

// elavelerin sonu

		fs.writeFileSync('./category.json', JSON.stringify({
			cat
		}, null, 4))
	}
})