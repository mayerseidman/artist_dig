const express = require('express');
const os = require('os');
const app = express();
const ocrSpaceApi = require('ocr-space-api');

app.use(express.static('dist'));
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

app.get("/", (req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})

app.get('/api/extractText', function(req, res) {
	var imgName = req.query.imgName;
	console.log("EXTRACTTTTTTTTTTTTTTTT", imgName)

	var options =  { 
		apikey: '8f5d685ff588957',
	    language: 'eng',
	    imageFormat: 'image/png', // Image Type (PNG or GIF)
	    isOverlayRequired: true
	};

	console.log(options)

	// Image file to upload
	// Running off of my desktop for now....have to make this eventually read off database...
	const imageFilePath = "/Users/mayerseidman/Downloads/" + imgName + ""

	// Run and wait the result
	ocrSpaceApi.parseImageFromLocalFile(imageFilePath, options)
		.then(function (parsedResult) {
		  	console.log(parsedResult)
		  	var parsedText  = parsedResult.parsedText;
		    console.log('parsedText: \n', parsedText);
		    // Add support in regex for all Operating Systems Windows would be \r\n, but Linux just uses \n and Apple uses \r.
		    var formattedTextArray  = parsedText.replace(/\d\.\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g, "\n").split("\n");
		    // var results = [parsedResult.parsedText.replace(/\d\.\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g, "").split('.').join("").split("\n")];
		    // console.log(results)
		    res.send({ results: formattedTextArray })
		    console.log('ocrParsedResult: \n', parsedResult.ocrParsedResult);
	  	}).catch(function (err) {
		console.log('ERROR:', err);
	});
})