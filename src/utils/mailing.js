import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import logger from '../logger/index.logger.js';
import jwt from 'jsonwebtoken';
dotenv.config();

//TODO: maybe turn into a class/service

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendPwResetEmail = async (user) => {
    try {
        const expiresIn = '1h';
        const token = jwt.sign({ status: true }, process.env.JWT_SECRET, {
            expiresIn,
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `
                <h2>Hi ${user.firstName}! You requested a password reset.</h2>
                <h3>Click the link to reset your password.</h3>
                <a href="http://localhost:3000/api/users/password/reset/${token}">Reset Password</a> 
                <p>If you did not request a password reset, please ignore this email.</p>
            `, // MEMO: href value should change according to the current domain
        };
        const response = await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error('Error: ', error);
    }
};

const sendNotificateSell = async (purchaseID) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: 'New sale',
            html: `
                <h1>Hey! There's been a new sale confirmed.</h1>
                <h3>Order ID: ${purchaseID}</h3>
                <p>Check recent sales in the site.</p>
            `,
        };
        const response = await transporter.sendMail(mailOptions);
    } catch (error) {}
};

const sendPurchaseMail = async (user, purchase) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'Purchase Confirmation',
            html: `
                <h1>Hi ${
                    user.firstName
                }! Your order is already in the making.</h1>
                <h2>Order Summary</h2>
                <ul>
                    <li>Order ID: ${purchase.code}</li>
                    <li>Order Items: ${purchase.products.map((item) => {
                        return `
                            <ul style="{
                                list-style-type: none;
                                display: flex;
                                justify-content: space-between;
                                width: 100%;
                                outline 1px solid black;
                            }">
                                <li>Product: ${item.product.title}</li>
                                <li>Quantity: ${item.quantity}</li>
                                <li>Price: $${item.product.price}</li>
                                <li>Total: $${
                                    item.product.price * item.quantity
                                }</li>
                            </ul>
                        `;
                    })}</li>
                    <li>Order Date: ${purchase.createdAt}</li>
                    <li>Order Total: ${purchase.subtotal}</li>
                </ul>
                <p>Thank you for trusting us!</p>
            `,
        };
        const response = await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error('Error: ', error);
    }
};

export default { sendPwResetEmail, sendNotificateSell, sendPurchaseMail };
