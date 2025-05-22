import  *as repo from '../repository/studentRepository.js';
import {json} from "express";

export const  addStudent = (req, res) => {
    const success = repo.addStudent(req.body);
    if(success){
        res.status(204).send();
    }else {
       res.status(409).send();
    }
}

export const findStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if(student){ //если такой студент есть
        //delete  student.password; если это база данных
        const tmp = {...student}; // делаем копию, потому что это не база данных, а мы сами сделали объект
        delete tmp.password; // удаляем пароль так в документации
        res.json(tmp); // возвращаем объект
    }else {
        res.status(404).send(); // если нет такого, то ошибка 404
    }
}

export const updateStudent = (req, res) => {
    const student = repo.updateStudent(+req.params.id, req.body);
    if(student){
        const tmp = {...student};
        delete tmp.scores;
        res.json(tmp);
    }else {
        res.status(404).send();
    }
}

export const deleteStudent = (req, res) => {
    const student = repo.deleteStudent(+req.params.id);
    if(student){
        delete  student.password;
        res.json(student);
    }else {
        res.status(404).send();
    }
}

export const addScore = (req, res) => {
    const id = +req.params.id;
    const success = repo.addScore(id, req.body);
    if(success){
        res.status(204).send();
    }else {
        res.status(404).send(`Student with id ${id} not found`);
    }
}

export const findByName = (req, res) => {
    const name = req.params.name;
    const result = repo.findByName(name);
    if (result.length > 0){
        const foundStudents = result.map(student => {
            const tmp = { ...student};
            delete tmp.password;
            return tmp;
        })
        res.json(foundStudents);
    } else {
        res.status(404).send();
    }
}

export const countByNames = (req, res) => {
    const names = req.query.names;
    if(!names) {
       return res.status(400).send();
    }
        const result = Array.isArray(names) ? names : [names];
        const count = repo.countByNames(result);
        res.json(count);
}

export const findByMinScore = (req, res) => {
    const exam = req.params.exam;
    const minScore = +req.params.minScore;
    const result = repo.findByMinScore(exam, minScore);
    if (result.length > 0) {
        const foundStudents = result.map(student => {
            const tmp = { ...student};
            delete tmp.password;
            return tmp;
        });
        res.json(foundStudents);
    } else {
        res.status(404).send();
    }
}