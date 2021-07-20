const express = require('express');
const router = express.Router();
const connection = require('../../config');
/* const Joi = require('joi'); */
const { validateTracks } = require('../../utils/validation');

// récupérer la liste complète des pistes
router.get('/', (req, res) => {
  const sql = `SELECT * FROM track`;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).send(results);
    }
  });
});

//filtrer les albums par titre ou artiste

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

// récupérer une piste par son ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM track WHERE id=?`;
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

// créer une nouvelle piste
router.post('/', (req, res) => {
  const { title, youtube_url, id_album } = req.body;

  const error = validateTracks(title, youtube_url, id_album);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    const sql = `INSERT INTO track SET ?`;
    connection.query(sql, req.body, (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        const id = results.insertId;
        const sql = `SELECT * FROM track WHERE id=?`;
        connection.query(sql, [id], (err, results) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            res.status(201).send(results);
          }
        });
      }
    });
  }
});

// mettre à jour une piste
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM track WHERE id=?`;

  const { title, youtube_url, id_album } = req.body;
  const error = validateTracks(title, youtube_url, id_album);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    connection.query(sql, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'ressource not found' });
      } else {
        const sql = `UPDATE track SET ? WHERE id=?`;

        connection.query(sql, [req.body, id], (err, results) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            res.sendStatus(204);
          }
        });
      }
    });
  }
});

//supprimer une piste
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM track WHERE id=?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'ressource not found' });
    } else {
      const sql = `DELETE FROM track WHERE id=?`;
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

module.exports = router;
