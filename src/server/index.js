
const express = require('express');
const os = require('os');
const app = express();
const ocrSpaceApi = require('ocr-space-api');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();
const _ = require('underscore')

// app.use(express.static('dist'));
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

const path = require('path');
const distPath = path.join(__dirname, '../..', 'dist')
app.use(express.static(distPath))

app.get("/", (req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies 

var unirest = require('unirest');
var morgan = require('morgan');
app.use(morgan('combined'));

// app.get('/api/extractText', function(req, res) {
// 	var imgName = req.query.imgName;
// 	console.log("EXTRACTTTTTTTTTTTTTTTT", imgName)

// 	var options =  { 
// 		apikey: process.env.OCR_API_KEY,
// 	    language: 'eng',
// 	    imageFormat: 'image/png', // Image Type (PNG or GIF)
// 	    isOverlayRequired: true
// 	};

// 	console.log(options)

// 	// Image file to upload
// 	// Running off of my desktop for now....have to make this eventually read off database...
// 	const imageFilePath = "/Users/mayerseidman/Downloads/" + imgName + ""

// 	// Run and wait the result
// 	ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
// 		console.log("!", imageFilePath)
// 		.then(function (parsedResult) {
// 		  	console.log(parsedResult)
// 		  	var parsedText  = parsedResult.parsedText;
// 		    console.log('parsedText: \n', parsedText);
// 		    // Add support in regex for all Operating Systems Windows would be \r\n, but Linux just uses \n and Apple uses \r.
// 		    var formattedTextArray  = parsedText.replace(/\d\.\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g, "\n").split("\n");
// 		    // var results = [parsedResult.parsedText.replace(/\d\.\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g, "").split('.').join("").split("\n")];
// 		    // console.log(results)
// 		    res.send({ results: formattedTextArray })
// 		    console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);
// 	  	}).catch(function (err) {
// 		console.log('ERROR:', err);
// 	});
// })

var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
        	cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});

const dir = path.join(__dirname, '../..', 'uploads')
app.use('/uploads', express.static(dir))


app.post('/api/uploadFile', upload.single("myImage"), async (req, res) => {
	console.log("show me file", req.file, req.headers.host)
	// const file = req.file;
	try {
		const parsedResult = await uploadImage(req.file)
		res.json(parsedResult);
	} catch(err) {
		console.log(err)
		res.send(400);
	}
});

function check (artist) {
	var excludedWords = ["SATURDAY", "SUNDAY", "FRIDAY", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER", "@", ".COM" ,"TICKET", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10 PM", "11PM", "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM","11AM", ":00", ":30", "10.", "16.", "17.", "20.", "22.", "30.", "O1H", "02H", "03H", "04H", "05H", "06H", "07H", "08H", "09H", "10H", "11H", "12H", "13H", "14H", "15H", "16H", "17H", "18H", "19H", "20H", "21H", "22H", "23H", "24H", "PRESENTS", "HTTP", "NOON", "PST", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9", "-10", "-11", "-12", "SEND MESSAGE", "VANCOUVER", "SAN DIEGO"]
	function contains(target, pattern){
	    var value = 0;
		pattern.forEach(function(word){
	    	value = value + target.toUpperCase().includes(word);
	    });
	    return (value >= 1)
	}
	return contains(artist, excludedWords);
}


// for PRODUCTION pass REQ into this function and then access file and hostname off of it...
function uploadImage(file) {
	return new Promise(function(resolve, reject) {
		unirest.post('https://api.ocr.space/parse/image')
			.headers({
				'apikey': '2fde8e881488957s'
			})
			.field('language', 'eng')
			// .field('url', 'http://dl.a9t9.com/ocrbenchmark/eng.png')
			// .field('url', 'http://' + req.headers.host + '/' + req.file.path)
			.field('url', 'https://379615ef56fa.ngrok.io/' + file.path)
			.end(function (res) {

				var rawBody = JSON.parse(res.raw_body);

				if (rawBody.IsErroredOnProcessing) return reject(rawBody);

				// console.log(JSON.parse(res.raw_body)) // files wont work above 1mb!!
				// replace all link breaks with one simple break and then split on the line break thereby ensuring each array item is separated on its own
				// var result = JSON.parse(res.raw_body).ParsedResults[0].ParsedText.replace(/[•\t.+]/g, '').replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split("\n")
				console.log(res.raw_body)
				var parsedResults = JSON.parse(res.raw_body).ParsedResults[0].ParsedText;
				// var result = parsedResults.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split("\n");
				// console.log(parsedResults.replace(/[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g, "").split("\n"));
				console.log("Parsed String:", parsedResults)
				var cleanedResult = parsedResults.replace(/([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s*([AaPp][Mm])?|(\d *- *\d)?|[0-9]/g, "")
				var result = cleanedResult.replace(/[•\t|]|[()]+/g, "\n").split("\n");
				console.log(result)
				
				var sortedResult = _.reject(result, function(artist) {
					return check(artist)
				});
				var trimmedResult = sortedResult.map(r => r.trim());
				var nonEmpty = trimmedResult.filter(function(v){return v!==''})
				console.log(trimmedResult, nonEmpty);
				resolve(nonEmpty);
			});
	});
}

// const asyncFun = () => {
// 	return new Promise(resolve => {
// 		setTimeout(() => resolve("Promise value RETURNED BISCH") 3000)	
// 	})
// }

// (async function() {
//   const data = await asyncFun()
//   console.log(data)
// }())
