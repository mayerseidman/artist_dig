
const express = require('express');
const os = require('os');
const app = express();
const ocrSpaceApi = require('ocr-space-api');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();
const _ = require('underscore')


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

var multer = require('multer');
const dir = path.join(__dirname, '../..', 'uploads')
app.use('/uploads', express.static(dir))

var uploadsDIR = "uploads";

fs.readdir(__dirname, (err, files) => { 
  if (err) 
    console.log(err); 
  else { 
    console.log("\nCurrent directory filenames:"); 
    files.forEach(file => { 
      console.log(file); 
    }) 
  } 
})  

//CLEAR UPLOADS OF IMAGES
fs.readdir(uploadsDIR, (err, files) => {
	console.log(__dirname)
	if (err) throw err;

	for (const file of files) {
		fs.unlink(path.join(uploadsDIR, file), err => {
			if (err) throw err;
		});
	}
});

// UPLOAD PLUGIN  //
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


// UPLOAD LINEUP FOR SCRAPING //
app.post('/api/uploadFile', upload.single("myImage"), async (req, res) => {
	try {
		const parsedResult = await uploadImage(req, req.file);
		res.json(parsedResult);
	} catch(err) {
		console.log(err)
		res.send(400);
	}
});

// CHECK FOR & REMOVE NON-ARTIST WORDS //
function check (artist) {
	var excludedWords = ["SATURDAY", "SUNDAY", "FRIDAY", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER", "@", ".COM" ,"TICKET", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10 PM", "11PM", "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM","11AM", ":00", ":30", "10.", "16.", "17.", "20.", "22.", "30.", "O1H", "02H", "03H", "04H", "05H", "06H", "07H", "08H", "09H", "10H", "11H", "12H", "13H", "14H", "15H", "16H", "17H", "18H", "19H", "20H", "21H", "22H", "23H", "24H", "PRESENTS", "HTTP", "NOON", "PST", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9", "-10", "-11", "-12", "SEND MESSAGE", "VANCOUVER", "SAN DIEGO", "TBA", "PRESENT", "PRESENTS", "ALPHABETICAL", "NETHERLANDS", "BELGIUM", "FESTIVAL", "DAY 1", "DAY 2", "DAY 3", "HTTP", ".3", ".4", ".5", ".00", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9."]
	function contains(target, pattern){
	    var value = 0;
		pattern.forEach(function(word){
	    	value = value + target.toUpperCase().includes(word);
	    });
	    return (value >= 1)
	}
	return contains(artist, excludedWords);
}


// WHEN IN DEVELOPMENT PASS SIMPLY UPDATE NGROK URL
// SCRAPE IMAGE FOR ARTISTS, TURN STRING INTO ARRAY, SEND TO FRONT END //
function uploadImage(req, file) {
	console.log(req.protocol + "://" + req.hostname + "/" + file.path)
	return new Promise(function(resolve, reject) {
		unirest.post('https://api.ocr.space/parse/image')
		.headers({
			'apikey': process.env.OCR_API_KEY
		})
		.field('language', 'eng')
		// DEVELOPMENT .field('url', 'https://1dbfb987fa12.ngrok.io/' + file.path) 
		.field('url', process.env.NODE_ENV === "production" ? (req.protocol + "://" + req.hostname + "/" + file.path) : ('https://343658cfd234.ngrok.io/' + file.path)) 
		.end(function (res) {
			var rawBody = JSON.parse(res.raw_body);
			if (rawBody.IsErroredOnProcessing) return reject(rawBody);
			console.log(res.raw_body)
			
			var parsedResults = JSON.parse(res.raw_body).ParsedResults[0].ParsedText;
			console.log("Parsed String:", parsedResults)
			var cleanedResult = parsedResults.replace(/([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s*([AaPp][Mm])?|(\d *- *\d)?|[0-9]/g, "");
			
			// REPLACE LINES OR CIRCLES (ANYTHING THAT SIGNIFIES NEW ARTIST) INTO LINE BREAKS AND THEN SPLIT ON THOSE AND CREATE ARRAY OF INDIV STRINGS
			var result = cleanedResult.replace(/[•\t|:]|[()]+/g, "\n").split("\n");
			console.log(result)
			
			// REJECT EXCLUDED WORDS FROM RESULT ARRAY
			var sortedResult = _.reject(result, function(artist) {
				return check(artist);
			});
			
			var trimmedResult = sortedResult.map(r => r.trim());
			var nonEmpty = trimmedResult.filter(function(v){return v!==''});
			console.log(trimmedResult, nonEmpty);
			
			resolve(nonEmpty);
		});
	});
}