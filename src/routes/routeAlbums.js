const express = require('express');
const router = express.Router();
const connection = require('../../config');
const { validateAlbum } = require('../../utils/validation');
const Joi = require('joi');

// récupérer la liste complète des albums
router.get('/', (req, res) => {
  const sql = `SELECT * FROM album`;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).send(results);
    }
  });
});

//filtrer les albums par genre ou titre

router.get('/search', (req, res) => {
  const obj = req.query;

  let SQL = `SELECT * FROM album`;
  let SqlQuery = [];
  let index = 0;
  for (const [key, value] of Object.entries(obj)) {
    if (index === 0) {
      SQL += ` WHERE ${key}=?`;
      SqlQuery.push(value);
    } else {
      SQL += ` AND ${key}=?`;
      SqlQuery.push(value);
    }
    index++;
  }

  connection.query(SQL, SqlQuery, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// récupérer un album par son ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM album WHERE id=?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'ressource not found' });
    } else {
      res.status(200).send(results);
    }
  });
});

// récupérer la liste des morceaux d'un album
router.get('/:id/tracks', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT t.id, t.title, t.youtube_url, t.id_album
    FROM album as a 
    JOIN track as t 
    ON a.id=t.id_album 
    WHERE a.id=?`;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'ressource not found' });
    } else {
      res.status(200).send(results);
    }
  });
});

// créer un nouvelle album
router.post('/', (req, res) => {
  const { title, genre, picture, artist } = req.body;
  const sql = `INSERT INTO album (title, genre, picture, artist) VALUES (?,?,?,?)`;
  const error = validateAlbum(title, genre, picture, artist);
  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    connection.query(sql, [title, genre, picture, artist], (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        //res.status(201).json({ id: results.insertId, ...req.body });
        res.status(201).send(results);
      }
    });
  }
});

// mettre à jour un album
/* router.put('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM album WHERE id=?`;
  connection.query(sql, [id], (err, results) => {
    console.log(results);
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'ressource not found' });
    } else {
      const sql = `UPDATE album SET ? WHERE id=?`;
      connection.query(sql, [req.body, id], (err, results) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(204).send('OK');
        }
      });
    }
  });
}); */

/* router.put('/:id', (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE album SET ? WHERE id=?`;
  connection.query(sql, [req.body, id], (err, results) => {
    console.log(results.affectedRows);
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'ressource not found ' });
    } else {
      //res.sendStatus(204);
    }
  });
}); */

//supprimer une piste
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM album WHERE id=?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'ressource not found' });
    } else {
      const sql = `DELETE FROM album WHERE id=?`;
      connection.query(sql, [id], (err, results) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(204).send('OK');
        }
      });
    }
  });
});

/* router.delete('/:id', (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM album WHERE id=?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'ressource not found ' });
    } else {
      res.status(204).send('OK');
    }
  });
}); */

module.exports = router;
