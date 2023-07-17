import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import logger from '../logger/index.logger.js';
import jwt from 'jsonwebtoken';
dotenv.config();

// Maybe can be turned into a class/service

// Creates the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Sends a password reset email with the jwt token that will expire in 1h
const sendPwResetEmail = async (user) => {
  try {
    const expiresIn = '1h';

    // Creates the token
    const token = jwt.sign({ status: true }, process.env.JWT_SECRET, {
      expiresIn,
    });

    // Creates the email's options object
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      html: `
                <h2>Hi ${user.firstName}! You requested a password reset.</h2>
                <h3>Click the link to reset your password.</h3>
                <a href="https://coderhouse-backend-final.onrender.com/api/users/password/reset/${token}">Reset Password</a> 
                <p>If you did not request a password reset, please ignore this email.</p>
            `,
    };

    // Sends the email
    const response = await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error: ', error);
  }
};

// Sends a new purchase notification to the admin / store owner
const sendNotificateSell = async (purchaseID) => {
  try {
    // Creates the email's options object with the purchase ID
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

    // Sends the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error: ', error);
  }
};

// Sends a purchase confirmation email to the user
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
                                list-style: none;
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
                            \n\n
                        `;
                    })}</li>
                    <li>Order Date: ${purchase.purchase_datetime}</li>
                    <li>Order Total: $${purchase.subtotal}</li>
                </ul>
                <p>Thank you for trusting us!</p>
            `,
    };

    // Sends the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error: ', error);
  }
};

// Sends a deletion notice to the inactive users that have been deleted
const sendDeletionNotice = async (user) => {
  try {
    // Creates the email's options object
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Account Deletion',
      html: `
                <h1>Hi ${user.firstName}!</h1>
                <h2>Your account has been deleted due to inactivity in the last two days.</h2>
                <p>We're sorry to see you go :(.</p>
            `,
    };

    // Sends the email
    const response = await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error: ', error);
  }
};

// Sends a product deletion notice to the deleted product's owner
const sendProductDeletionNotice = async (product, ownerEmail) => {
  try {
    // Creates the email's options object
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: ownerEmail,
      subject: 'Product Deletion',
      html: `
                <h1>Hi! Your product has been deleted.</h1>
                <h2>Product ID: ${product._id}</h2>
                <h2>Product Title: ${product.title}</h2>
            `,
    };
    // Sends the email
    const response = await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error: ', error);
  }
};

export default {
  sendPwResetEmail,
  sendNotificateSell,
  sendPurchaseMail,
  sendDeletionNotice,
  sendProductDeletionNotice,
};
