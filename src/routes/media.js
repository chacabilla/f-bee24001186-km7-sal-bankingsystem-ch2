const router = require('express').Router();
const storage = require('../libs/multer');
const { storageImage } = require('../services/media');

router.post('/image', storage.image.single('image'), storageImage);

module.exports = router;