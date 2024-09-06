import jwt from "jsonwebtoken";
import userModel from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
import { sendEmail } from "../../utls/email.js";
import { customAlphabet } from "nanoid";
import xlsx from 'xlsx'


export const register = async (req, res) => {

        const { userName, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
        

        const createUser = await userModel.create({ userName, email, password: hashedPassword });
        

        console.log('User saved successfully:', createUser);
        

        const token = jwt.sign({ email }, process.env.CONFIRMEMAIL);
        const html = `
        <!DOCTYPE html>
        <html>
        <body>
            <p>Confirm your email by clicking the link below:</p>
            <a href="http://localhost:3000/auth/confirmEmail/${token}">Confirm email</a>
        </body>
        </html>
        `;
        

        await sendEmail(email, 'Welcome to our service', html);
        

        return res.status(201).json({ message: 'User registered successfully', user: createUser });
        

};



export const login = async (req, res) => {
    const { password, email } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(409).json({ message: 'invalid data , email not found' });
    }


    if (!user.confirmEmail) {
        return res.status(400).json({ message: "please confirm your email" });
    }

    if (user.status == "NotActive") {
        return res.status(403).json({ message: 'your account is bloked' });
    }

    const match = bcrypt.compareSync(password, user.password);

    if (!match) {
        return res.status(400).json({ message: 'invalid data , password not match' });
    }
    const token = jwt.sign({ id: user._id, status: user.status }, process.env.LOGINSIG)

    return res.status(200).json({ message: "success", token })
}


export const sendCode = async (req, res) => {
    const { email } = req.body;

    // Generate a unique code
    const generateCode = customAlphabet('123456789abcdef', 4);
    const code = generateCode(); // Generate the code

    // Find the user and update with the new code
    const user = await userModel.findOneAndUpdate(
        { email },
        { sendCode: code }, // Store the generated code in the user model
        { new: true }
    );

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    // Send email with the code
    await sendEmail(email, 'Reset Password', `<h2>${code}</h2>`);

    // Return success response
    return res.status(200).json({ message: "success", code });
};


export const forgotPassword = async (req, res) => {
    const { email, password, code } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "email not found" });
    }

    if (user.sendCode != code) {
        return res.status(400).json({ message: "invalid code" });
    }

    user.password = await bcrypt.hash(password, parseInt(process.env.SALTROUND));

    user.sendCode = null;

    await user.save();

    res.json({ message: "Password updated successfully" });
};

export const confirmEmail = async (req, res) => {
    const token = req.params.token
    const decoded = jwt.verify(token , process.env.CONFIRMEMAIL)
    await userModel.findByIdAndUpdate({ email: decoded.email} , {confirmEmail:true})
    return res.status(200).json({ message:"success" });
}




