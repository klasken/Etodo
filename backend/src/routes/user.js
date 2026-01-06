const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const middle_ware = require("../middleware/auth");
const bcrypt = require("bcryptjs");

router.get("/user", middle_ware, (req, res) => {
    const user_id = req.user.user_id;
    pool.query(
        "SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?",
        [user_id],
        (err, results) => {
            if (err) return res.status(500).json({ "msg": "Internal server error" });
            if (results.length === 0) return res.status(404).json({ "msg": "Not found" });
            return res.status(200).json(results[0]);
        }
    );
});

router.get("/user/todos", middle_ware, (req, res) => {
    const user_id = req.user.user_id;
    pool.query(
        "SELECT * FROM todo WHERE user_id = ?",
        [user_id],
        (err, results) => {
            if (err) return res.status(500).json({ "msg": "Internal server error" });
            return res.status(200).json(results);
        }
    );
});

router.get("/users/:data", middle_ware, (req, res) => {
    const data = req.params.data;
    let query = "SELECT id, email, password, created_at, firstname, name FROM user WHERE ";
    let params = [];

    if (/^\d+$/.test(data)) {
        query += "id = ?";
        params.push(data);
    } else {
        query += "email = ?";
        params.push(data);
    }
    pool.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ "msg": "Internal server error" });
        if (results.length === 0) return res.status(404).json({ "msg": "Not found" });
        return res.status(200).json(results[0]);
    });
});

router.put("/users/:id", middle_ware, (req, res) => {
    const id = req.params.id;   
    const { email, password, firstname, name } = req.body;

    if (!email || !password || !firstname || !name) {
        return res.status(400).json({ "msg": "Bad parameter" });
    }
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ "msg": "Internal server error" });
        }
        pool.query(
            "UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?",
            [email, hash, firstname, name, id],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ "msg": "Internal server error" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ "msg": "Not found" });
                }
                pool.query("SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?", [id], (err, rows) => {
                    if (err) {
                        return res.status(500).json({ "msg": "Internal server error" });
                    }
                    return res.status(200).json(rows[0]);
                });
            }
        );
    });
});

router.delete("/users/:id", middle_ware, (req, res) => {
    const id = req.params.id;
    pool.query(
        "DELETE FROM user WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": "Internal server error" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ "msg": "Not found" });
            }
            return res.status(200).json({ "msg": `Successfully deleted record number: ${id}` });
        }
    );
});

module.exports = router;
