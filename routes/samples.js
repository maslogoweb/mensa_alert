'use strict';
var express = require('express');
var router = express.Router();

var client = require('cheerio-httpcli');

/* サンプルAPI①
 * http://localhost:3000/samples にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.get('/', function(req, res, next) {
	var param = { 値: 'これはサンプルAPIです' };
	res.header('Content-Type', 'application/json; charset=utf-8');
	res.send(param);
});

/* サンプルAPI②
 * http://localhost:3000/samples/hello にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.get('/hello', function(req, res, next) {
	var param = { result: 'Hello World !' };
	res.header('Content-Type', 'application/json; charset=utf-8');
	res.send(param);
});

/* サンプルAPI3
 * http://localhost:3000/samples/getschedules にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.get('/getschedules', function(req, res, next) {
	var result_array = new Array();
	client.fetch('https://mensa.jp/exam/', function(err, $, res, body) {
		// リンク一覧を表示
		$('ul').each(function(idx) {
			var prefecture = $(this)
				.text()
				.match(/[\u30e0-\u9fcf]*[都,道,府,県]/i);
			var datetime = $(this)
				.text()
				.match(/日時 ： (.*)\n/i);
			var state = $(this)
				.children()
				.find('img')
				.attr('alt');
			if (prefecture != null) {
				result_array.push({
					prefecture: prefecture[0],
					datetime: datetime[1],
					state: state
				});
			}
		});
	});
	setTimeout(() => {
		var param = { result: result_array };
		res.header('Content-Type', 'application/json; charset=utf-8');
		res.send(param);
	}, 500);
});

module.exports = router;
