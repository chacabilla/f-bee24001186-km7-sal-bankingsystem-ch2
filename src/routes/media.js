const router = require('express').Router();
const storage = require('../libs/multer');
const { storageImage, imagekitUpload } = require('../services/media');

const multer = require('multer');
router.post('/image', storage.image.single('image'), storageImage); //using multer
router.post('/upload', multer().single('image'), imagekitUpload); //using imagekit

module.exports = router;