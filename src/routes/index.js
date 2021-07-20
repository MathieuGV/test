const express = require('express');
const router = express.Router();

const routerTracks = require('./routeTracks');
const routerAlbums = require('./routeAlbums');

router.use('/tracks', routerTracks);
router.use('/albums', routerAlbums);


module.exports = router;



