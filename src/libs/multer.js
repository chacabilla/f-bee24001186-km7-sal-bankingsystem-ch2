import multer, { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

const generateFilename = (req, file, cb) => {
    const filename = Date.now() + extname(file.originalname);
    cb(null, filename);
}

const generateStorage = (folder) => {
    const dir = resolve(__dirname, '..', 'uploads', folder);

    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }

    return diskStorage({
        destination: (req, file, cb) => {
            cb(null, dir);
        },
        filename: generateFilename
    });
}

export const image = multer({
    storage: generateStorage('images'),
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});