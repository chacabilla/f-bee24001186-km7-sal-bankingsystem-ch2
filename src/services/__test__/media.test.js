const mediaService = require('../media');
const httpMocks = require('node-mocks-http');

describe('Media Service - storageImage', () => {
    test('should respond with a success message and image URL', () => {
        const req = httpMocks.createRequest({
            protocol: 'http',
            file: { filename: 'test-image.jpg' },
            headers: {
                host: 'localhost:3000'  // Setting host in headers directly
            }
        });
        const res = httpMocks.createResponse();

        mediaService.storageImage(req, res);

        const data = res._getJSONData();
        expect(data.status).toBe(true);
        expect(data.message).toBe('Image uploaded successfully');
        expect(data.data.image_url).toBe('http://localhost:3000/images/test-image.jpg');
    });

    test('should return a 400 error if no file is uploaded', () => {
        const req = httpMocks.createRequest({
            protocol: 'http',
            get: () => 'localhost:3000'
        });
        const res = httpMocks.createResponse();

        mediaService.storageImage(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: false,
            message: 'No file uploaded',
        });
    });
});
