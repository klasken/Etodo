const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const middle_ware = require("../middleware/auth");

router.get("/", middle_ware, (req, res) => {
    pool.query(
        "SELECT * FROM todo",
        (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": "Internal server error" });
            }
            return res.status(200).json(results);
        }
    );
});

router.get("/:id", middle_ware, (req, res) => {
    const id = req.params.id;
    pool.query(
        "SELECT * FROM todo WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": "Internal server error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ "msg": "Not found" });
            }
            return res.status(200).json(results[0]);
        }
    );
});

router.post("/", middle_ware, (req, res) => {
    const { title, description, due_time, status, user_id } = req.body;

    if (!title || !description || !due_time || !status || !user_id) {
        return res.status(400).json({ "msg": "Bad parameter" });
    }
    pool.query(
        "INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)",
        [title, description, due_time, status, user_id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": "Internal server error" });
            }
            pool.query("SELECT * FROM todo WHERE id = ?", [results.insertId], (err, rows) => {
                if (err) return res.status(500).json({ "msg": "Internal server error" });
                return res.status(201).json(rows[0]);
            });
        }
    );
});

router.put("/:id", middle_ware, (req, res) => {
    const { title, description, due_time, status, user_id } = req.body;
    const id = req.params.id;

    if (!title || !description || !due_time || !status || !user_id) {
        return res.status(400).json({ "msg": "Bad parameter" });
    }
    pool.query(
        "UPDATE todo SET title = ?, description = ?, due_time = ?, status = ?, user_id = ? WHERE id = ?",
        [title, description, due_time, status, user_id, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ "msg": "Internal server error" });
            }
            pool.query("SELECT * FROM todo WHERE id = ?", [id], (err, rows) => {
                if (err) return res.status(500).json({ "msg": "Internal server error" });
                return res.status(200).json(rows[0]);
            });
        }
    );
});

router.delete("/:id", middle_ware, (req, res) => {
    const id = req.params.id;

    pool.query(
        "DELETE FROM todo WHERE id = ?",
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
