const express = require("express");
const fsExtra = require("fs-extra");
const uniqid = require("uniqid");
const {
  readFile,
  append,
  getByID,
  getByIDAndUpdate,
  remove,
  validateReviewsBody,
} = require("../utilities");
const { join } = require("path");
const { validationResult } = require("express-validator");

const router = express.Router();
const reviewsPath = join(__dirname, "reviews.json");
router
  .route("/")
  .get(async (req, res, next) => {
    try {
      let data = await readFile(reviewsPath);
      res.send(data);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .post(validateReviewsBody(), async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let uniqueID = {
        _id: uniqid(),
        createdAt: new Date(),
      };
      const writtenData = await append(reviewsPath, req.body, uniqueID);
      res.send(writtenData);
    } catch (e) {
      e.httpRequestStatusCode = 500;
    }
  });
router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;
      let movie = await getByID(reviewsPath, id, "_id");
      res.send(movie);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .put(validateReviewsBody(), async (req, res, next) => {
    try {
      const { id } = req.params;

      let updatedArray = await getByIDAndUpdate(
        reviewsPath,
        id,
        req.body,
        "_id"
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
      let filteredData = await remove(reviewsPath, id, "_id");
      res.send(filteredData);
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  });

module.exports = router;
