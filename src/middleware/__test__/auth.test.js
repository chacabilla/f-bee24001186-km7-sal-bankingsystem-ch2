const authMiddleware = require('../auth');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
    let request, response, next;

    beforeEach(() => {
        request = httpMocks.createRequest();
        response = httpMocks.createResponse();
        next = jest.fn();
    });

    test('should call next() if token is valid', () => {
        const token = jwt.sign({ id: 1 }, 'secret');
        request.headers['authorization'] = `Bearer ${token}`;

        authMiddleware(request, response, next);
        expect(next).toHaveBeenCalled();
        expect(request.user).toEqual(expect.objectContaining({ id: 1 }));
    });

    test('should return 401 if no token is provided', () => {
        authMiddleware(request, response, next);
        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response._getData())).toEqual({ error: 'Token not provided' });
    });

    test('should return 403 if token is invalid', () => {
        request.headers['authorization'] = 'Bearer invalidtoken';

        authMiddleware(request, response, next);
        expect(response.statusCode).toBe(403);
        expect(JSON.parse(response._getData())).toEqual({ error: 'Invalid token' });
    });
});
