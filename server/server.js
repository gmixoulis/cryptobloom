const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'web3_flower_shop',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Create transporter
let transporter;

async function initializeTransporter() {
    if (process.env.SMTP_HOST) {
        // ... (existing SMTP logic) ...
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        console.log('Using Custom SMTP server:', process.env.SMTP_HOST);
    } else {
        // ... (existing Ethereal logic) ...
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log('Using Ethereal Email test account:', testAccount.user);
        } catch (error) {
            console.error('Failed to create Ethereal test account:', error);
        }
    }
}

initializeTransporter();

// Endpoint to send receipt
app.post('/api/receipt', async (req, res) => {
    const { email, transactionHash, flowerName, price, currency = 'ETH' } = req.body;

    if (!email || !transactionHash || !flowerName || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Store transaction in DB
        const result = await pool.query(
            'INSERT INTO transactions (email, flower_name, amount, currency, tx_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, flowerName, price, currency, transactionHash]
        );
        console.log('Transaction stored:', result.rows[0]);

        if (!transporter) {
            return res.status(500).json({ error: 'Email service not initialized' });
        }

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Web3 Flower Shop" <receipts@flowershop.web3>', // sender address
            to: email, // list of receivers
            subject: `Receipt for your ${flowerName}`, // Subject line
            text: `Thank you for your purchase!\n\nYou bought: ${flowerName}\nPrice: ${price}\nTransaction Hash: ${transactionHash}\n\nYour flowers will be delivered soon!`, // plain text body
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">Purchase Receipt</h2>
                    <p>Thank you for shopping with Web3 Flower Shop!</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Order Details</h3>
                        <p><strong>Item:</strong> ${flowerName}</p>
                        <p><strong>Price:</strong> ${price}</p>
                        <p><strong>Transaction Hash:</strong> <a href="${currency === 'ETH' ? `https://sepolia.etherscan.io/tx/${transactionHash}` : '#'}" target="_blank" style="color: #4f46e5;">${transactionHash}</a></p>
                    </div>

                    <p>We hope you enjoy your flowers!</p>
                </div>
            `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.status(200).json({
            message: 'Receipt sent successfully',
            previewUrl: nodemailer.getTestMessageUrl(info),
            transaction: result.rows[0]
        });

    } catch (error) {
        console.error('Error processing receipt:', error);
        res.status(500).json({ error: 'Failed to process receipt' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
