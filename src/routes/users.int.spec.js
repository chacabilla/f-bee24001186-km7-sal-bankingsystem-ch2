const request = require('supertest');
const app = require('../../index'); // Pastikan ini mengimpor aplikasi Express
const userService = require('../services/users');

jest.mock('../services/users');

describe('GET /api/v1/users', () => {
    let server;

    beforeAll((done) => {
        server = app.listen(3000, () => {
            done();
        });
    });

    afterAll((done) => {
        server.close(done); // Menutup server setelah semua pengujian selesai
    });

    it('should return all users', async () => {
        const mockUsers = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
        userService.getAllUsers.mockResolvedValue(mockUsers);

        const response = await request(server).get('/api/v1/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
    });

    it('should return 500 if an error occurs', async () => {
        userService.getAllUsers.mockRejectedValue(new Error('Database error'));

        const response = await request(server).get('/api/v1/users');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Database error' });
    });
});
