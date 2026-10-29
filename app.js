const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "cse",
    password: "1234",
    database: "student_database"
});

db.getConnection()
    .then(connection => {
        console.log("MY SQL!");
        connection.release();
    })
    .catch(error => {
        console.log("fail", error.message);
    });

app.get("/", (req, res) => {
    res.send("welcome to student api");
});

app.get("/students", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM students");
        res.json(rows);
    }
    catch (error) {
        res.send("Database error." + error.message);
    }
});

app.post("/students", async (req, res) => {
    try {
        const { name, age } = req.body;

        await db.execute(
            "INSERT INTO students(name, age) VALUES(?, ?)",
            [name, age]
        );

        res.send("student added successfully");
    }
    catch (error) {
        res.send("database error:" + error.message);
    }
});

app.put("/students/:id", async (req, res) => {
    try {
        const { name, age } = req.body;

        await db.execute(
            "UPDATE students SET name=?, age=? WHERE id=?",
            [name, age, req.params.id]
        );

        res.send("student updated");
    }
    catch (error) {
        res.send("database error:" + error.message);
    }
});

app.delete("/students/:id", async (req, res) => {
    try {
        await db.execute(
            "DELETE FROM students WHERE id=?",
            [req.params.id]
        );

        res.send("student deleted !");
    }
    catch (error) {
        res.send("database error:" + error.message);
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000/students");
});