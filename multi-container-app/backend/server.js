const expresss = require("express");
const bodyParser = require("body-parser");

const db = require("./db");

const app = expresss();

app.use(bodyParser.json());

// db.pool.query(`CREATE TABLE list (
//     id INTEGER AUTO_INCREMENT,
//     value TEXT,
//     PRIMARY KEY (id)
// )`, (err, results, fields) => console.log("results: ", results));

app.get("/api/values", function (req, res) {
    db.pool.query("SELECT * FROM list;",
        (err, results, fields) => {
            if (err) return res.status(500).send(err);
            return res.json(results)
        })
});

app.post("/api/value", (req, res, next) => {
    db.pool.query(`INSERT INTO list (value) VALUES("${req.body.value}")`,
        (err, results, fields) => {
            if (err) return res.status(500).send(err);
            return res.json({ success: true, value: req.body.value });
        })
});

app.listen(5000, () => {
    console.log("애플리케이션이 5000번 포트에서 시작되었습니다.");
});