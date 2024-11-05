module.exports = {
    storageImage: (req, res) => {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        return res.status(200).json({
            status: true,
            message: 'Image uploaded successfully',
            data: {
                image_url: imageUrl
            }
        }); }
    
};