import express from "express";
import { UserModel } from "./user.collection.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "./mail.js";
import multer from "multer";
import cors from "cors";
import { dbConnection } from "./dbConnection.js";

const app = express()
const port = 8080;
app.use(cors())

app.use(bodyParser?.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const STATUS = {
    SUCCESS: "success",
    FAILURE: "error"
}


const upload = multer({ dest: './public/data/uploads/' });


app.post("/signup", upload.single('uploaded_file'), async (req, res) => {
    try {
        const { name, email, mobile, password, image } = req?.body
        const userDetails = {
            name, email, mobile
        }
        console.log("file", req.file);
        const salt = bcrypt.genSaltSync(10);
        userDetails.password = bcrypt.hashSync(password, salt)
        console.log("file", req.file, req.body)
        const userModel = new UserModel(userDetails);
        await userModel.save();
        return res.status(200).send({ status: STATUS.SUCCESS, statusCode: 200, message: "User added successfully" });
    } catch (error) {
        return res.status(400).send({ statusCode: 400, status: STATUS.FAILURE, message: "Error while creating docs.", error: error?.message });
    }
})

app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req?.body;
        console.log("body", req?.body)
        const userInfo = await UserModel.findOne({ email });
        console.log("userInfo", userInfo)
        if (!userInfo) {
            return res.status(404).send({ statusCode: 404, status: STATUS.FAILURE, message: "User not found" });
        }
        console.log("password", userInfo?.password)
        const isPasswordValid = await bcrypt?.compare(password, userInfo?.password);
        console.log("isPasswordValid", isPasswordValid)
        if (!isPasswordValid) {
            return res.status(401).send({ statusCode: 401, status: STATUS.FAILURE, message: "Password is invalid" });
        }
        const tokenData = {
            name: userInfo?.name,
            email: userInfo?.email,
            mobile: userInfo?.mobile
        }
        const token = jwt.sign(tokenData, "auth-key");
        return res.status(200).send({ status: STATUS.SUCCESS, statusCode: 200, token, userData: tokenData, message: "User logged in successfully" });
    } catch (error) {
        return res.status(400).send({ message: "Error while login", statusCode: 400, status: STATUS.FAILURE, error: error?.message });
    }
})

app.get("/generate-otp", async (req, res) => {
    try {
        const token = req?.headers?.authorization;
        const decode = jwt?.decode(token);
        if (!token) {
            return res?.status(400).send({ status: STATUS.FAILURE, statusCode: 400, message: "Token invalid" });
        }
        console.log("decode", decode);
        const userInfo = await UserModel.findOne({ email: decode?.email })
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log("otp", otp)
        const user = {
            otp,
            name: userInfo?.name,
            email: userInfo?.email,
        }
        console.log("user", user);
        await sendMail(user);
        return res?.status(200).send({ status: STATUS.SUCCESS, statusCode: 200, message: "Mail Sent successfully" })

    } catch (error) {
        return res?.status(400).send({ status: STATUS.FAILURE, statusCode: 400, message: "Something went wrong", message: error?.message, error })
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    dbConnection()
})