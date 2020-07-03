const express = require("express");
const fsExtra = require("fs-extra");
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
      console.log(req.body);
      const writtenData = await append(mediaPath, req.body);
      res.send(writtenData);
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
      let movie = await getByID(mediaPath, id);
      res.send(movie);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .put(validateBody(), async (req, res, next) => {
    try {
      const { id } = req.params;
      let updatedArray = await getByIDAndUpdate(mediaPath, id, req.body);
      res.send(updatedArray);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      let filteredData = await remove(mediaPath, id);
      res.send(filteredData);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  });

module.exports = router;
