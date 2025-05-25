let collection;

export function init(db){
    collection = db.collection("college");
}

export const addStudent = async ({id, name, password}) => {
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
    return await collection.findOne({_id: id});
}

export const deleteStudent = async (id) => {    ;
    return await collection.findOneAndDelete({_id: id});
    //найти и удалить
}

export const updateStudent = async (id, data) => {
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
    return await collection.find({name: {$regex: `^${name}$`, $options: 'i'}}).toArray();
    //найди нэйм, но игнорируй регистр
}

// export const countByNames = (names) => {
//     names = names.map(name => name.toLowerCase());
//     return Array.from(students.values()).filter(s => names.includes(s.name.toLowerCase())).length;
// }
//
// export const findByMinScore = (exam, minScore) => {
//     return Array.from(students.values()).filter(s => s.scores[exam] >= minScore);
// }
