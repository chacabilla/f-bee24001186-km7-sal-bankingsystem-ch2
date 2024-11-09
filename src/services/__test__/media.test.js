require('dotenv').config();

const mediaService = require('../media');
const httpMocks = require('node-mocks-http');

jest.mock('imagekit', () => {
    return jest.fn().mockImplementation(() => ({
        upload: jest.fn(() => Promise.resolve({ url: 'https://mocked_url.com/image.jpg' })),
    }));
});

describe('Media Service - storageImage', () => {
    test('should respond with a success message and image URL', async () => {
        const req = httpMocks.createRequest({
            protocol: 'http',
            file: { filename: 'test-image.jpg' },
            headers: {
                host: 'localhost:3000'
            }
        });
        const res = httpMocks.createResponse();

        await mediaService.storageImage(req, res);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data.status).toBe(true);
        expect(data.message).toBe('Image uploaded successfully');
        expect(data.data.image_url).toBe('http://localhost:3000/images/test-image.jpg');
    });

    test('should return a 400 error if no file is uploaded', async () => {
        const req = httpMocks.createRequest({
            protocol: 'http',
            get: () => 'localhost:3000'
        });
        const res = httpMocks.createResponse();

        await mediaService.storageImage(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: false,
            message: 'No file uploaded',
        });
    });
});

describe('Media Service - imagekitUpload', () => {
    test('should respond with a success message and ImageKit URL', async () => {
        const req = httpMocks.createRequest({
            file: { buffer: Buffer.from('fake-image-data'), mimetype: 'image/jpeg', originalname: 'test-image.jpg' }
        });
        const res = httpMocks.createResponse();

        // Call the mediaService method for imagekitUpload
        await mediaService.imagekitUpload(req, res);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data.status).toBe(true);
        expect(data.message).toBe('Image uploaded successfully');
        expect(data.data.image_url).toBe('https://mocked_url.com/image.jpg');
    });

    test('should return a 400 error if no file is uploaded for ImageKit', async () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        await mediaService.imagekitUpload(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: false,
            message: 'No file uploaded',
        });
    });
});
