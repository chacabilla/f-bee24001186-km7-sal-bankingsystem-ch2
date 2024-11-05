const multer = require('multer');
const path = require('path');
const fs = require('fs');

const generateFilename = (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
}

const generateStorage = (folder) => {
    const dir = path.resolve(__dirname, '..', 'uploads', folder);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dir);
        },
        filename: generateFilename
    });
}

module.exports = {
    image: multer({
        storage: generateStorage('images'),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type'), false);
            }
        }
    })
};