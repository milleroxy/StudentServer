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
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: {[`scores.${exam}`]: score}},
    )
}

export const findByName = async (name) => {
    return await collection.find({name: {$regex: `^${name}$`, $options: 'i'}}).toArray();
    //найди нэйм, но игнорируй регистр
}

export const countByNames = async (names) => {
    const lowerNames = names.map(n => n.toLowerCase());
    return await collection.countDocuments({
        $expr: {
            $in: [{$toLower: '$name'}, lowerNames]
        }
    });
}

export const findByMinScore = async (exam, minScore) => {
    const query = {};
    query[`scores.${exam}`] = { $gte: minScore };
    return await collection.find(query).toArray();

}
