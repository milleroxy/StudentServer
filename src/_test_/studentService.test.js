// studentService.test.js
import { jest } from '@jest/globals';

// Мокаем модуль ДО импорта сервиса
jest.unstable_mockModule('../repository/studentRepository.js', () => ({
    findStudentById: jest.fn(),
    createStudent: jest.fn(),
    deleteStudentById: jest.fn(),
    updateStudent: jest.fn(),
    updateStudentScore: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByNames: jest.fn(),
    findStudentsByMinScore: jest.fn(),
}));

// Динамически импортируем сервис и репозиторий
let service;
let repo;

beforeAll(async () => {
    // Импортировать после моков
    service = await import('../services/studentService.js');
    repo = await import('../repository/studentRepository.js');
});

beforeEach(() => {
    // Сброс моков перед каждым тестом
    jest.clearAllMocks();
});

describe('studentService', () => {
    test('addStudent should return false if student already exists', async () => {
        repo.findStudentById.mockResolvedValue({ _id: '123' });

        const result = await service.addStudent({ id: '123', name: 'John', password: 'pass' });
        expect(result).toBe(false);
        expect(repo.findStudentById).toHaveBeenCalledWith('123');
        expect(repo.createStudent).not.toHaveBeenCalled();
    });

    test('addStudent should create student if not exists', async () => {
        repo.findStudentById.mockResolvedValue(null);
        repo.createStudent.mockResolvedValue();

        const result = await service.addStudent({ id: '123', name: 'John', password: 'pass' });
        expect(result).toBe(true);
        expect(repo.createStudent).toHaveBeenCalledWith({ _id: '123', name: 'John', password: 'pass' });
    });

    test('findStudent should return student without password', async () => {
        repo.findStudentById.mockResolvedValue({ _id: '123', name: 'John', password: 'secret' });

        const result = await service.findStudent('123');
        expect(result).toEqual({ _id: '123', name: 'John', password: undefined });
    });

    test('deleteStudent should return student without password', async () => {
        repo.deleteStudentById.mockResolvedValue({ _id: '123', name: 'John', password: 'secret' });

        const result = await service.deleteStudent('123');
        expect(result).toEqual({ _id: '123', name: 'John', password: undefined });
    });

    test('updateStudent should return student without scores', async () => {
        repo.updateStudent.mockResolvedValue({ _id: '123', name: 'John', scores: [90] });

        const result = await service.updateStudent('123', { name: 'Johnny' });
        expect(result).toEqual({ _id: '123', name: 'John', scores: undefined });
    });

    test('addScore should delegate to repo', async () => {
        repo.updateStudentScore.mockResolvedValue({ _id: '123', scores: [{ exam: 'math', score: 90 }] });

        const result = await service.addScore('123', 'math', 90);
        expect(result).toEqual({ _id: '123', scores: [{ exam: 'math', score: 90 }] });
    });

    test('findByName should return students without passwords', async () => {
        repo.findStudentsByName.mockResolvedValue([
            { _id: '1', name: 'John', password: '123' },
            { _id: '2', name: 'Johnny', password: '456' },
        ]);

        const result = await service.findByName('John');
        expect(result).toEqual([
            { _id: '1', name: 'John', password: undefined },
            { _id: '2', name: 'Johnny', password: undefined },
        ]);
    });

    test('countByNames should delegate to repo', async () => {
        repo.countStudentsByNames.mockResolvedValue(5);

        const result = await service.countByNames(['John', 'Jane']);
        expect(result).toBe(5);
    });

    test('findByMinScore should return students without passwords', async () => {
        repo.findStudentsByMinScore.mockResolvedValue([
            { _id: '1', name: 'John', password: '123' },
            { _id: '2', name: 'Jane', password: '456' },
        ]);

        const result = await service.findByMinScore('math', 50);
        expect(result).toEqual([
            { _id: '1', name: 'John', password: undefined },
            { _id: '2', name: 'Jane', password: undefined },
        ]);
    });
});
