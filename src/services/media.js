const imagekit = require('../libs/imagekit');

module.exports = {
    storageImage: (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: 'No file uploaded',
            });
        }
        
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        return res.status(200).json({
            status: true,
            message: 'Image uploaded successfully',
            data: {
                image_url: imageUrl
            }
        }); 
    },
    
        imagekitUpload: async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({
                        status: false,
                        message: 'No file uploaded',
                    });
                }
        
                const stringFile = req.file.buffer.toString('base64'); // Convert buffer to base64 string
        
                const uploadFile = await imagekit.upload({
                    file: stringFile,
                    fileName: req.file.originalname,
                    useUniqueFileName: true,
                    folder: '/uploads',
                });
        
                // Respond with the image URL from ImageKit
                return res.status(200).json({
                    status: true,
                    message: 'Image uploaded successfully',
                    data: {
                        image_url: uploadFile.url, // This is the URL returned by ImageKit
                    },
                });
            } catch (err) {
                throw new Error(err.message);
            }
    }
};