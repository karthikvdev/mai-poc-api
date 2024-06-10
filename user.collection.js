import { Schema } from "mongoose";
import mongoose from "mongoose";

const schema = new Schema({
    name: String,
    email: String,
    mobile: String,
    password: String
}, {
    timestamps: true
});

export const UserModel = mongoose?.model('Test', schema, 'user');