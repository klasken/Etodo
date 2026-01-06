const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonweb = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();
const secret_key = process.env.SECRET;

router.post("/register", async (req, res) => {
    const { email, password, firstname, name } = req.body;

    if (!email || !password || !firstname || !name) {
        return res.status(400).json({ "msg": "Bad parameter" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Tentative d'inscription pour :", email);
        pool.query(
            "INSERT INTO user (email, password, firstname, name) VALUES (?, ?, ?, ?)",
            [email, hashedPassword, firstname, name],
            (err, results) => {
                if (err) {
                    console.error(">>> ERREUR SQL DÉTAILLÉE :", err);
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ "msg": "Account already exists" });
                    }
                    return res.status(500).json({ "msg": "Internal server error" });
                }
                const token = jsonweb.sign({ email: email, user_id: results.insertId }, secret_key, { expiresIn: "1h" });
                return res.status(201).json({ "token": token });
            }
        );
    } catch (e) {
        console.error(">>> ERREUR BCRYPT/SERVER :", e);
        return res.status(500).json({ "msg": "Internal server error" });
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ "msg": "Bad parameter" });
    }
    pool.query(
        "SELECT id, email, password FROM user WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": "Internal server error" });
            }
            if (results.length === 0) {
                return res.status(401).json({ "msg": "Invalid Credentials" });
            }
            try {
                const match = await bcrypt.compare(password, results[0].password);
                if (match) {
                    const token = jsonweb.sign({ email: results[0].email, user_id: results[0].id }, secret_key, { expiresIn: "1h" });
                    return res.status(200).json({ "token": token });
                } else {
                    return res.status(401).json({ "msg": "Invalid Credentials" });
                }
            } catch (e) {
                return res.status(500).json({ "msg": "Internal server error" });
            }
        }
    );
});

module.exports = router;
