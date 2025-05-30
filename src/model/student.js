import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    score: {
        type: Map,
        of: Number,
        default: {}
    }
}, {
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

const Student = mongoose.model('Student', studentSchema, 'students');
//обязательно указать коллекцию. у нас college
export default Student;
