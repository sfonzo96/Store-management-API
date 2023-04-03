import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import logger from '../logger/index.logger';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export const sendNotificateSell = async (purchaseID) => {
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

export const sendPurchaseMail = async (user, purchase) => {
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
