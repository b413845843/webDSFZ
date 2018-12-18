var express = require('express');
var router = express.Router();

var path = require('path')
var filePath = path.join(__dirname, 'fp.pdf')

const PDFExtract = require('pdf.js-extract').PDFExtract;
// import {PDFExtract} from 'pdf.js-extract'; // or with typescript
const pdfExtract = new PDFExtract();
const options = {}; /* see below */

router.post('/parse', (req, res) => {
  console.log(`filePath : ${filePath}`);
  try {
    pdfExtract.extract(filePath, options, (err, data) => {
      if (err) return console.log(err);
      console.log(data.pages[0].content);
      res.send(data.pages[0].content)
  });
  } catch (error) {
    console.log(error);
  }

 
})

module.exports = router