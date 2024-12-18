const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "plantsDatabase",
  port: 3308,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// app.get("/:id/:name", (req, res) => {
//   res.send("Hello World!");
//   console.log(req.params);
// });

//@ POST
// app.post("/plants", (req, res) => {
//   let sql;
//   sql = `INSERT INTO plants
//     (name,height,type)
//     VALUES('${req.body.name}','${req.body.height}','${req.body.type}')`;

//   connection.query(sql);
//   res.json({ message: "Data inserted" });
// });

app.post("/plants", (req, res) => {
  let sql;
  sql = `INSERT INTO plants
    (name,height,type) 
    VALUES(?,?,?)`;

  connection.query(sql, [req.body.name, req.body.height, req.body.type]);
  res.json({
    message: "Data inserted",
    plants: {
      name: req.body.name,
      height: req.body.height,
      type: req.body.type,
    },
  });
});

app.get("/plants", (req, res) => {
  let sql;
  sql = "SELECT * FROM plants";

  connection.query(sql, function (err, result) {
    if (err) throw err;

    res.json(result);
  });
});

app.get("/plants/:id", (req, res) => {
  let sql;
  sql = "SELECT * FROM plants where id=?";

  connection.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.log("Error while fetching");
      return res.status(500).json({
        message: "Error while fetching",
        error: err.message,
      });
    }
    if (result.lenght === 0) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(result[0]);
  });
});

// @PUT update
app.put("/plants/:id", (req, res) => {
  let sql = "UPDATE plants set name = ?, height = ?, type= ? where id = ?";
  connection.query(
    sql,
    [req.body.name, req.body.height, req.body.type, req.params.id],
    (err, result) => {
      const selectSql = "select * from plants where id =?";

      connection.query(selectSql, [req.params.id], (err, updatedResult) => {
        res.json({
          message: "Record updated",
          updatedResult: updatedResult[0],
        });
      });
    }
  );
});

// @delete
app.delete("/plants/:id", (req, res) => {
  let sql = "delete from plants where id = ?";
  connection.query(sql, [req.params.id], function (err, result) {
    if (err) {
      return res
        .status(500)
        .json({ message: "error deleting data", error: err.message });
    }
    res.json({
      message: "record deleted",
      result: {
        id: req.body.id,
        name: req.body.name,
        height: req.body.height,
        type: req.body.type,
      },
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
