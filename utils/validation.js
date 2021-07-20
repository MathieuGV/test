const Joi = require('joi');

const validateTracks = (title, youtube_url, id_album) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    youtube_url: Joi.string().required(),
    id_album: Joi.number().required(),
  });

  const { error } = schema.validate({
    title,
    youtube_url,
    id_album,
  });

  return error;
};

const validateAlbum = (title, genre, picture, artist) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    picture: Joi.string().required(),
    artist: Joi.string().required(),
  });

  const { error } = schema.validate({
    title,
    genre,
    picture,
    artist,
  });

  return error;
};

module.exports = {
  validateTracks,
  validateAlbum,
};
