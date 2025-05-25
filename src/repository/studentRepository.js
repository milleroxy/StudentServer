import dotenv from "dotenv";
dotenv.config();

import {MongoClient} from "mongodb";
// const url = 'mongodb://edd:1234@localhost:27017/java59?authSource=admin';
//
// dotenv.config();

const dbName = 'java59';
const client = new MongoClient(process.env.MONGO_URI);
let collection;

export async function connect() { // подключаем базу данных
    // if (!(client.topology && client.topology.isConnected())) {
    //     await client.connect();
    // }
    if (!client.topology?.isConnected()) { // проверка на то, создана ли база (топология) и приконектилась ли база
        await client.connect(); // получить коллекцию
    }
    const db = client.db(dbName);  // сщздали коллекцию
    collection = db.collection("college"); // дали название коллекции, инициализируем
}


export const addStudent = async ({id, name, password}) => {
    await connect();
    const existing = await collection.findOne({_id: id});
    if (existing) {
        return false;
        //если такой студент есть, то не добавляем
    }
    await collection.insertOne({_id: id, name, password, scores: {}});
    //если такого нет, то вставляем такого студента с параметрами (баллы - пустой объект)
    //
    return true;
}

export const findStudent = async (id) => {
    await connect();
    return await collection.findOne({_id: id});
}

export const deleteStudent = async (id) => {
    await connect();
    return await collection.findOneAndDelete({_id: id});
    //найти и удалить
}

export const updateStudent = async (id, data) => {
    await connect();
    return await collection.findOneAndUpdate( // найти и обновить
        {_id: id},
        {$set: data},
        {returnDocument: 'after'} //вернуть тот который после апдейта
    )
}

export const addScore = async (id, exam, score) => {
    await connect();
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: {[`scores.${exam}`]: score}},
    )
}

export const findByName = async (name) => {
    await connect();
    return await collection.find({name: {$regex: `^${name}$`, $options: 'i'}}).toArray();
}

// export const countByNames = (names) => {
//     names = names.map(name => name.toLowerCase());
//     return Array.from(students.values()).filter(s => names.includes(s.name.toLowerCase())).length;
// }
//
// export const findByMinScore = (exam, minScore) => {
//     return Array.from(students.values()).filter(s => s.scores[exam] >= minScore);
// }
