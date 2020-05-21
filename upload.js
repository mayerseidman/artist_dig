var unirest = require('unirest');
// for PRODUCTION pass REQ into this function and then access file and hostname off of it...
function uploadImage(file) {
	console.log(file)
	return new Promise(function(resolve, reject) {
		var req = unirest('POST', 'https://api.ocr.space/parse/image')
		.headers({
			'apikey': '2fde8e881488957s'
		})
		.field('language', 'eng')
		// .field('url', 'http://dl.a9t9.com/ocrbenchmark/eng.png')
		// .field('url', 'http://' + req.hostname + '/' + req.file.path) for PRODUCTION
		.field('url', 'https://f9fe6115.ngrok.io' + file.path)
		.end(function (res) {
			if (res.error) reject(res.error);
			// replace all link breaks with one simple break and then split on the line break thereby ensuring each array item is separated on its own
			// console.log(JSON.parse(res.raw_body).ParsedResults[0].ParsedText.replace(/[•\t.+]/g, '').replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split("\n"))
			// var result = JSON.parse(res.raw_body).ParsedResults[0].ParsedText.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split("\n");
			resolve(res.raw_body);
		});
	});
}
