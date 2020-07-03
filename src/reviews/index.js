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
      };
      const writtenData = await append(reviewsPath, req.body, uniqueID);
      res.send(writtenData);
    } catch (e) {
      e.httpRequestStatusCode = 500;
    }
  });
router.route("/:id").get().put().delete();

module.exports = router;
