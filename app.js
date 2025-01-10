const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require('dotenv').config()
const app = express();
const secretkey = process.env.secretKey
const newsecretkey = process.env.newSecretKey
const student = require("./models/db")
const port = 3000;

app.use(express.json());

app.post(
    '/api/register',
    [
        body('username').not().isEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        // Check if user already exists
        const existingUser = await student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new student({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    }
);

// Login API
app.post(
    '/api/login',
    [
        body('username').not().isEmpty().withMessage('username is required'),
        body('password').not().isEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const username = req.body.username;
        const password = req.body.password;

        const user = await student.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, secretkey, { expiresIn: '1h' });
        res.status(200).send({ msg: 'User Login successfully' });
    }
);

// Forget Password API (Send Reset Link)
app.post('/api/forget-password', async (req, res) => {
    const email = req.body.email;

    const user = await student.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: 'Enter Registered Email' });
    }

    // Generate Reset Token (this is just for demo purposes, you can create a more secure way)
    const resetToken = jwt.sign({ userId: user._id }, newsecretkey, { expiresIn: '15m' });

    // Send Reset Token via Email (Use a real email service here)
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: '<your-email>@ethereal.email',
    //         pass: '<your-password>'
    //     }
    // });
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'dennis.walter13@ethereal.email',
            pass: 'Hyj2wSpucTBvDdea8r'
        }
    });

    const resetUrl = `http://localhost:${port}/api/reset-password/${resetToken}`;
    const emailBody = `
    <html>
        <body>
            <p>You can reset your password using the following link: 
                <a href="${resetUrl}">Click Here</a>
            </p>
        </body>
    </html>
`;

    const mailOptions = {
        from: 'no-reply@admin.com',
        to: email,
        subject: 'Passowrd Reset Link',
        html: emailBody
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ msg: 'Error sending email' });
        }
        res.status(200).json({ msg: 'Password reset link sent' });
    });
});

// Reset Password API
app.post('/api/reset-password/:token', async (req, res) => {
    const password = req.body.password;
    const token = req.params.token;

    try {
        const decoded = jwt.verify(token, newsecretkey);
        const user = await student.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: 'Password reset successful' });
    } catch (error) {
        return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }
});

app.listen(port, () => {
    console.log(`server runing on http://localhost:${port}`)
})
