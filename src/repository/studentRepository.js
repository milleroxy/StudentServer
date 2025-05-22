import {Student} from "../model/student.js";

const students = new Map();

export const addStudent = ({id, name, password}) => {
    if(students.has(id)) {
        return false;
    }
    students.set(id, new Student(id, name, password));
    return true;
}

export const findStudent = id => students.get(id);


export const deleteStudent = id => {
    const student = students.get(id); // получаем студента
    if (student) {
        students.delete(id); // удаляем из Map
        return student; // возвращаем удалённого
    }
    return undefined; // если не найден
};

export const updateStudent = (id, data) => {
    const student = students.get(id);
    if(student) {
        Object.assign(student, data);
        return student;
    }
}

export const addScore = (id, data) => {
    const student = students.get(id);
    if(student) {
        const {examName, score} = data;
        student.scores[examName] = score;
        return true;
    }
    return false;
}

export const findByName = name => {
    const result =[];
    const studentArray = Array.from(students.values());
    for (let  i = 0; i < studentArray.length; i++) {
        const student = studentArray[i];
        if (student.name.toLowerCase() === name.toLowerCase()) {
            result.push(student);
        }
    }
    return result;
}

export const countByNames = names => {
    let count = 0;
    const studentArray = Array.from(students.values());
    for (let  i = 0; i < studentArray.length; i++) {
        const student = studentArray[i];
        for(let j = 0; j < names.length; j++) {
            if(student.name.toLowerCase() === names[j].toLowerCase()){
                count++;
                break;
            }
        }
    }
    return count;
}

export const findByMinScore = (exam, minscore) => {
    const result =[];
    const studentArray = Array.from(students.values());
    for (let  i = 0; i < studentArray.length; i++){
        const student = studentArray[i];
        const score = student.scores[exam];
        if(score !== undefined && score >= minscore){
            result.push(student);
        }
    }
    return result;
}
