
const express = require('express');
const os = require('os');
const app = express();
const ocrSpaceApi = require('ocr-space-api');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

app.use(express.static('dist'));
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

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
//         }
//     }
// });

var multer = require('multer');
var upload = multer({dest:'uploads/'});


app.post('/api/uploadFile', upload.single("myImage"), (req, res) => {
	console.log("show me something", req.file)
	// var lat = req.body.lat;
	// var long = req.body.long;
	// res.send({ lat })
	try {
		res.send(req.file);
		}catch(err) {
	    res.send(400);
	}
});

// var unirest = require('unirest');
// var req = unirest('POST', 'https://api.ocr.space/parse/image')
// 	.headers({
// 		'apikey': '2fde8e881488957s'
// 	})
// 	.field('language', 'eng')
// 	.field('url', 'http://dl.a9t9.com/ocrbenchmark/eng.png')
// 	.end(function (res) { 
// 		if (res.error) throw new Error(res.error);
// 		// replace all link breaks with one simple break and then split on the line break thereby ensuring each array item is separated on its own
// 		console.log(JSON.parse(res.raw_body).ParsedResults[0].ParsedText.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split("\n")); 
// 	});

