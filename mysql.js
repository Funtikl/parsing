const mysql = require("mysql");
const phoneJson = require("./phones.json");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "samsung793",
  database: "prod"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected");
  var sql =
    "INSERT INTO products (name , id, link) VALUES ('Iphone', '1', 'www.apple.com')";
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log("record inserted");
  });
  console.log("connected as id " + connection.threadId);
});
