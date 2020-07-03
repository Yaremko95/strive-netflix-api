const fsExtra = require("fs-extra");
const uniqid = require("uniqid");
const { join } = require("path");
const {
  check,
  body,
  validationResult,
  sanitizeBody,
} = require("express-validator");

const validateBody = () => {
  return [
    check("imdbID")
      .exists()
      .withMessage("imdbID is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty"),
  ];
};

const validateReviewsBody = () => {
  return [
    check("comment")
      .exists()
      .withMessage("comment is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty"),
    check("rate")
      .exists()
      .withMessage("rate is required")
      .not()
      .isEmpty()
      .isInt({ min: 0, max: 5 })
      .withMessage("Can't be Empty"),
    check("elementId")
      .exists()
      .withMessage("elementId is required")
      .not()
      .isEmpty()
      .custom(async (id) => {
        let path = join(__dirname, "../media/media.json");
        let item = await getByID(path, id, "imdbID");
        if (item.length === 0) {
          throw new Error("movie doesn't exist");
        } else {
          return true;
        }
      })
      .withMessage("Can't be Empty"),
  ];
};

const readFile = async (path) => {
  let data = fsExtra.readJson(path);
  return data;
};

const append = async (path, data, uniqueKey = {}) => {
  let dataArray = await readFile(path);

  dataArray.push({ ...data, ...uniqueKey });
  const write = await fsExtra.writeJson(path, dataArray);
  return dataArray;
};
const getByID = async (path, id, key) => {
  let data = await readFile(path);
  let item = data.filter((item) => item[key] === id);
  return item;
};
const getByIDAndUpdate = async (path, id, data, uniqueKey) => {
  let dataArray = await readFile(path);
  let updatedData = dataArray.map(
    (item) => (item[uniqueKey] === id && { ...data, [uniqueKey]: id }) || item
  );
  let write = await fsExtra.writeJson(path, updatedData);
  return updatedData;
};
const remove = async (path, id, key) => {
  let dataArray = await readFile(path);
  dataArray = dataArray.filter((item) => item[key] !== id);
  let write = await fsExtra.writeJson(path, dataArray);
  return dataArray;
};

module.exports = {
  readFile,
  append,
  validateBody,
  getByID,
  getByIDAndUpdate,
  remove,
  validateReviewsBody,
};
