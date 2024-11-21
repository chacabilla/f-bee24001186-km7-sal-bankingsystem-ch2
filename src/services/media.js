import ImageKit from '../libs/imagekit.js';

export function storageImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: 'No file uploaded',
            });
        }

        // Validasi tipe file
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
            });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        return res.status(200).json({
            status: true,
            message: 'Image uploaded successfully',
            data: {
                image_url: imageUrl,
            },
        });
    } catch (error) {
        console.error('Error in storageImage:', error.message);
        return res.status(500).json({
            status: false,
            message: 'An error occurred while uploading the image.',
        });
    }
}

export async function imagekitUpload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: 'No file uploaded',
            });
        }

        // Validasi tipe file
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
            });
        }

        // Konversi file buffer ke Base64 string
        const stringFile = req.file.buffer.toString('base64');

        // Upload file ke ImageKit
        const uploadFile = await ImageKit.upload({
            file: stringFile,
            fileName: req.file.originalname,
            useUniqueFileName: true,
            folder: '/uploads',
        });

        // Respon URL gambar dari ImageKit
        return res.status(200).json({
            status: true,
            message: 'Image uploaded successfully',
            data: {
                image_url: uploadFile.url, // URL dari ImageKit
            },
        });
    } catch (error) {
        console.error('Error in imagekitUpload:', error.message);
        return res.status(500).json({
            status: false,
            message: 'An error occurred while uploading the image to ImageKit.',
        });
    }
}
