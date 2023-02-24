const express = require('express'); //import express
const multer = require('multer');
const upload = multer();

const router  = express.Router(); 

const displayController = require('./controllers'); 

router.get('/', displayController.home ); 

router.post('/upload', displayController.uploadFile, displayController.upload); 

router.get('/image/:id', displayController.image);

router.get('/delete/:id', displayController.deleteSlide);

router.get('/images', displayController.all);

router.get('/moveup/:id', displayController.moveup)

router.get('/movedown/:id', displayController.movedown)
 
module.exports = router; // export to use in server.js
