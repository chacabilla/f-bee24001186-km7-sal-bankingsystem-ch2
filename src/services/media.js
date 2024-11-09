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
                const stringFile = req.file.buffer.toString('base64');
        
                const uploadFile = await imagekit.upload({
                    file: stringFile,
                    fileName: req.file.originalname
                });
        
                return res.json({
                    status: true,
                    message: 'Image uploaded successfully',
                    data: {
                        name: uploadFile.name,
                        url: uploadFile.url,
                        type: uploadFile.fileType
                    }
                });    
            } catch (err) {
                throw err;
            }
        }
};