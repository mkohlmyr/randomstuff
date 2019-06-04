const express = require('express');
const app = express();
const bp = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const connection = new sqlite3.Database(':memory:');

connection.run('CREATE TABLE record (id INTEGER PRIMARY KEY, mood INTEGER, comment TEXT, date TEXT)');
connection.run('CREATE TABLE record_feeling (record_id, feeling_id)');

app.use(bp.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.get("/record", (req, res) => {
  connection.all('SELECT date, mood, comment, GROUP_CONCAT(feeling_id) as feelings FROM record_feeling JOIN record ON record_feeling.record_id = record.id GROUP BY record_feeling.record_id ORDER BY date DESC', (err, rows) => {
    rows.forEach((r) => {
      r.date = new Date(Number(r.date));
      if (r && r.feelings) {
        r.feelings = r.feelings.split(',').map(Number);
      }
    });
    if (err) throw err;
    res.send(JSON.stringify(rows));
  });
});

app.post('/record', (req, res) => {
  const data = req.body;

  // function must be unbound for RunResult lastID
  connection.run('INSERT INTO record (mood, comment, date) VALUES (?, ?, ?)', [data.mood, data.comment, new Date()], function (err) {
    if (err) throw err;
    const params = data.feelings.map(() => `(${this.lastID}, ?)`);
    connection.run(`INSERT INTO record_feeling (record_id, feeling_id) VALUES ${params}`, data.feelings, function (err) {
      if (err) throw err;
      res.send('200 OK');
    });
  });

});

app.listen(9000, '0.0.0.0');
