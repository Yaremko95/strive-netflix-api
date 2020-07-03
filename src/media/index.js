const express = require("express");
const fsExtra = require("fs-extra");
const uniqid = require("uniqid");
const multer = require("multer");
const axios = require("axios");
const {
  readFile,
  validateBody,
  append,
  getByID,
  getByIDAndUpdate,
  remove,
} = require("../utilities");
const { join } = require("path");
const { validationResult } = require("express-validator");

const router = express.Router();

const mediaPath = join(__dirname, "media.json");
const reviewsPath = join(__dirname, "../reviews/reviews.json");
const postersFolderPath = join(__dirname, "../posters");
const upload = multer({});
router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await readFile(mediaPath);
      res.send(data);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .post(validateBody(), async (req, res, next) => {
    try {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { imdbID } = req.body;
      let response = await axios.get(
        `http://www.omdbapi.com/?apikey=ac60feab&i=${imdbID}`
      );
      const { Title, Year, Type, Poster } = response.data;
      let newData = {
        Title,
        Year,
        Type,
        Poster,
        imdbID,
      };
      let updatedList = await append(mediaPath, newData);
      res.send(updatedList);
    } catch (e) {
      e.httpRequestStatusCode = 400;
      next(e);
    }
  });
router.route("/search").get(async (req, res, next) => {
  try {
    let response = await axios.get(`http://www.omdbapi.com/?apikey=ac60feab`, {
      params: { ...req.query },
    });
    res.send(response.data);
  } catch (e) {
    e.httpRequestStatusCode = 400;
    next(e);
  }
});
router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;
      let movie = await getByID(mediaPath, id, "imdbID");
      res.send(movie);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .put(validateBody(), async (req, res, next) => {
    try {
      const { id } = req.params;

      let updatedArray = await getByIDAndUpdate(
        mediaPath,
        id,
        req.body,
        "imdbID"
      );
      res.send(updatedArray);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      let filteredData = await remove(mediaPath, id, "imdbID");
      res.send(filteredData);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  });

router
  .route("/:id/upload")
  .post(upload.single("avatar"), async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const [name, extension] = req.file.originalname.split(".");
      await fsExtra.writeFile(
        join(postersFolderPath, `${id}.${extension}`),
        req.file.buffer
      );
      res.send("ok");
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

router.route("/:id/reviews").get(async (req, res, next) => {
  try {
    const { id } = req.params;
    let data = await getByID(reviewsPath, id, "elementId");
    res.send(data);
  } catch (e) {
    e.httpRequestStatusCode = 404;
    next(e);
  }
});

module.exports = router;
