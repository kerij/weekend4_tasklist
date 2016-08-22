var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/tasklist';

router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasks GROUP BY tasks.id ORDER BY tasks.completed ASC, tasks.id ASC;', function (err, result) {
      done(); //closes connection
      console.log(result.rows);

      if (err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res){
  var task = req.body;

  pg.connect(connectionString, function(err, client, done){
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO tasks(task)'
                + 'VALUES ($1)',
                [task.task],
                function (err, result) {
                  done();

                  if (err) {
                    console.log(err);
                    res.sendStatus(500);
                  } else {
                    res.sendStatus(201);
                  }
    });
  });
});

router.delete('/:id', function (req, res) {
  var id = (req.params.id);
  console.log("id", id);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM tasks ' +
                'WHERE id = $1',
                [id],
                function (error, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                    return;
                  }

                  res.sendStatus(200);
                });
  });
});

router.put('/:id', function(req, res){
  var id = req.params.id;
  var task = req.body;
  console.log("id:", id);
  console.log("task:", task);

    pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE tasks' +
                ' SET completed = $1' +
                ' WHERE id = $2',
              [task.completed, id],
            function (err, result){
              done();
              if (err) {
                console.log('err', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
  });
});



module.exports = router;
