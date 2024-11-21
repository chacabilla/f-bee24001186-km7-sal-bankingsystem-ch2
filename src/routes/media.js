const router = require('express').Router();
import { image } from '../libs/multer.js';
import { storageImage, imagekitUpload } from '../services/media.js';

import multer from 'multer';
router.post('/image', image.single('image'), storageImage); //using multer
router.post('/upload', multer().single('image'), imagekitUpload); //using imagekit

export default router;