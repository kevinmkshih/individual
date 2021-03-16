const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use("/individual/public", express.static('public'));
const mysql = require("mysql");
const path = require("path");
const port = 8000;
app.use(bodyParser.urlencoded({extended: false}));
const url = require("url");
const endpointRoot = "/individual";


const db = mysql.createConnection({
    host: "localhost",
    user: "kevinshi_admin",
    password: "admin",
    database: "kevinshi_individual"
});
db.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("Connected");
});

app.get(endpointRoot, (req, res) => {
    res.sendFile(path.join(__dirname + "/views/choose.html"));
});

app.get(endpointRoot + "/admin", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/admin.html"));
});

app.get(endpointRoot + "/student", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/student.html"));
});

app.post(endpointRoot + "/questions", (req, res) => {
    let q = url.parse(req.url, true);
    let numChoice = q.query['numberAnswer'];
    let q1 = q.query['q1'];
    let q2 = q.query['q2'];
    let q3 = q.query['q3'];
    let q4 = q.query['q4'];
    let question = q.query['question'];
    let correctAnswer = q.query['correctAnswer'];
    let sql;
    if (numChoice == 5) {
        sql = "INSERT INTO FOUR_QUESTION (question, q1, q2, q3, q4, correctAnswer) values ('" +
            question + "', '" + q1 + "', '" + q2 + "', '" + q3 + "', '" + q4 + "', '" + correctAnswer + "');";
    } else {
        sql = "INSERT INTO TWO_QUESTION (question, q1, q2, correctAnswer) values ('" +
            question + "', '" + q1 + "', '" + q2 + "', '" + correctAnswer + "');";

    }
    console.log(sql);
    db.query(sql, (err) => {
        res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
        if (err) {
            res.end("ERROR. Question already exists");
            console.log(err.message)
        } else {
            res.end("Stored question into DB");
            console.log("1 stored");
        }
    })

})

app.put(endpointRoot + "/questions", (req, res) => {
    let q = url.parse(req.url, true);
    let choice = q.query['choice'];
    let q1 = q.query['q1'];
    let q2 = q.query['q2'];
    let q3 = q.query['q3'];
    let q4 = q.query['q4'];
    let question = q.query['question'];
    let correctAnswer = q.query['correctAnswer'];
    console.log("this choice: " + choice)
    if (choice == 4) {
        sql = "SELECT * from FOUR_QUESTION WHERE question='" + question + "\'";
    } else {
        sql = "SELECT * from TWO_QUESTION WHERE question='" + question + "\'";
        console.log(sql)
    }

    let couldUpdate;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
        if (results.length === 0) {
            res.end("Failed to find question, couldn't update!");
            couldUpdate = false;
        } else {
            res.end("Stored question into DB");
            couldUpdate = true;
        }

        updateDatabase(couldUpdate, choice, q1, q2, q3, q4, question, correctAnswer);
    })
})

function updateDatabase(couldUpdate, choice, q1, q2, q3, q4, question, correctAnswer) {
    if (!couldUpdate) {
        return false;
    }
    if (choice == 4) {
        sql = "UPDATE FOUR_QUESTION SET Q1 ='" + q1 + "\', Q2 ='" + q2 + "\', Q3 ='" + q3 + "\', Q4 ='" + q4 + "\' " +
            ", correctAnswer = '" + correctAnswer + "' WHERE QUESTION = '" + question + "\'"
        console.log(sql)
        db.query(sql, (err, result) => {
            if (err) throw err;
        })
    } else {
        sql = "UPDATE TWO_QUESTION SET Q1 ='" + q1 + "\', Q2 ='" + q2 + "\' " +
            ", correctAnswer = '" + correctAnswer + "' WHERE QUESTION = '" + question + "\'"
        console.log(sql)
        db.query(sql, (err, result) => {
            if (err) throw err;
        })
    }
}

app.get(endpointRoot + "/questions", (req, res) => {
    sql = "SELECT * FROM FOUR_QUESTION";
        sql2 = "SELECT * FROM TWO_QUESTION";

    let FOUR_QUESTION;
    let TWO_QUESTION;
    db.query(sql, (err, results) => {
        if (err) throw err;
        FOUR_QUESTION = (results);
        db.query(sql2, (err, results) => {
            if (err) throw err;
            TWO_QUESTION = (results);
            let together = FOUR_QUESTION.concat(TWO_QUESTION)

            let togetherString = JSON.stringify(together)
            res.end(togetherString)
        });
    });



});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
