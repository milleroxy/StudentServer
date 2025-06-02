// src/_test_/studentController.test.js
import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// --- Мокаем сервис ---
jest.unstable_mockModule('../services/studentService.js', () => ({
    addStudent: jest.fn(),
    findStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
    addScore: jest.fn(),
    findByName: jest.fn(),
    countByNames: jest.fn(),
    findByMinScore: jest.fn()
}));

// --- Импорты ПОСЛЕ мока ---
const service = await import('../services/studentService.js');
const controller = await import('../controller/studentController.js');

// --- Настраиваем express-приложение ---
let app;

beforeAll(() => {
    app = express();
    app.use(express.json());

    app.post('/students', controller.addStudent);
    app.get('/students/count', controller.countByNames);
    app.get('/students/:id', controller.findStudent);
    app.put('/students/:id', controller.updateStudent);
    app.delete('/students/:id', controller.deleteStudent);
    app.post('/students/:id/score', controller.addScore);
    app.get('/students/name/:name', controller.findByName);
    app.get('/students/score/:exam/:minScore', controller.findByMinScore);
});

describe('studentController', () => {
    test('POST /students - valid student created (201)', async () => {
        service.addStudent.mockResolvedValue(true);

        const studentData = {
            id: 1,            // обязательно число
            name: 'Alice',    // обязательно строка
            password: 123456  // обязательно число, как в вашей схеме
        };

        const response = await request(app).post('/students').send(studentData);

        expect(response.status).toBe(201);
        expect(service.addStudent).toHaveBeenCalledWith(studentData);
    });

    test('POST /students - validation error (400)', async () => {
        const response = await request(app).post('/students').send({
            age: 22,
            email: 'invalid'
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    test('GET /students/:id - student found (200)', async () => {
        const fakeStudent = { id: 1, name: 'Bob' };
        service.findStudent.mockResolvedValue(fakeStudent);

        const response = await request(app).get('/students/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(fakeStudent);
        expect(service.findStudent).toHaveBeenCalledWith(1);
    });

    test('GET /students/:id - student not found (404)', async () => {
        service.findStudent.mockResolvedValue(null);

        const response = await request(app).get('/students/999');

        expect(response.status).toBe(404);
        expect(service.findStudent).toHaveBeenCalledWith(999);
    });

    test('PUT /students/:id - updated (200)', async () => {
        const updatedStudent = { id: 1, name: 'Updated Name' };
        service.updateStudent.mockResolvedValue(updatedStudent);

        const response = await request(app).put('/students/1').send({ name: 'Updated Name' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedStudent);
        expect(service.updateStudent).toHaveBeenCalledWith(1, { name: 'Updated Name' });
    });

    test('PUT /students/:id - validation error (400)', async () => {
        const response = await request(app).put('/students/1').send({ email: 'not-an-email' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    test('PUT /students/:id - student not found (404)', async () => {
        service.updateStudent.mockResolvedValue(null);

        const response = await request(app).put('/students/999').send({ name: 'Someone' });

        expect(response.status).toBe(404);
        expect(service.updateStudent).toHaveBeenCalledWith(999, { name: 'Someone' });
    });

    test('DELETE /students/:id - student deleted (200)', async () => {
        const deletedStudent = { id: 1, name: 'To Delete' };
        service.deleteStudent.mockResolvedValue(deletedStudent);

        const response = await request(app).delete('/students/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(deletedStudent);
        expect(service.deleteStudent).toHaveBeenCalledWith(1);
    });

    test('DELETE /students/:id - student not found (404)', async () => {
        service.deleteStudent.mockResolvedValue(null);

        const response = await request(app).delete('/students/999');

        expect(response.status).toBe(404);
        expect(service.deleteStudent).toHaveBeenCalledWith(999);
    });

    test('POST /students/:id/score - valid (204)', async () => {
        service.addScore.mockResolvedValue(true);

        const response = await request(app).post('/students/1/score').send({
            examName: 'Math',
            score: 95
        });

        expect(response.status).toBe(204);
        expect(service.addScore).toHaveBeenCalledWith(1, 'Math', 95);
    });

    test('POST /students/:id/score - validation error (400)', async () => {
        const response = await request(app).post('/students/1/score').send({
            examName: '',
            score: 'not-a-number'
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    test('POST /students/:id/score - conflict (409)', async () => {
        service.addScore.mockResolvedValue(false);

        const response = await request(app).post('/students/1/score').send({
            examName: 'Math',
            score: 80
        });

        expect(response.status).toBe(409);
        expect(service.addScore).toHaveBeenCalledWith(1, 'Math', 80);
    });

    test('GET /students/name/:name - found list (200)', async () => {
        const students = [{ id: 1, name: 'John' }, { id: 2, name: 'Johnny' }];
        service.findByName.mockResolvedValue(students);

        const response = await request(app).get('/students/name/John');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(students);
        expect(service.findByName).toHaveBeenCalledWith('John');
    });

    test('GET /students/count?names=John&names=Jane - count (200)', async () => {
        service.countByNames.mockResolvedValue(2);

        const response = await request(app).get('/students/count').query({ names: ['John', 'Jane'] });

        expect(response.status).toBe(200);
        expect(response.body).toBe(2);
        expect(service.countByNames).toHaveBeenCalledWith(['John', 'Jane']);
    });

    test('GET /students/score/:exam/:minScore - filtered students (200)', async () => {
        const filteredStudents = [{ id: 1, name: 'Alice', score: 90 }];
        service.findByMinScore.mockResolvedValue(filteredStudents);

        const response = await request(app).get('/students/score/Math/80');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(filteredStudents);
        expect(service.findByMinScore).toHaveBeenCalledWith('Math', 80);
    });
});
