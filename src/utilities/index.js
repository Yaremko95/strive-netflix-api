const fsExtra = require("fs-extra");
const uniqid = require("uniqid");
const {
  check,
  body,
  validationResult,
  sanitizeBody,
} = require("express-validator");

const validateBody = () => {
  return [
    check("Title")
      .exists()
      .withMessage("title is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty"),
    check("Year")
      .exists()
      .withMessage("year is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty"),
    check("Type")
      .exists()
      .withMessage("type is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty"),
    check("Poster")
      .exists()
      .withMessage("Poster is required")
      .not()
      .isEmpty()
      .withMessage("Can't be Empty")
      .isURL(),
  ];
};

const readFile = async (path) => {
  let data = fsExtra.readJson(path);
  return data;
};

const append = async (path, data) => {
  let dataArray = await readFile(path);
  dataArray.push({ ...data, imdbID: uniqid("tt") });
  const write = await fsExtra.writeJson(path, dataArray);
  return dataArray;
};
const getByID = async (path, id) => {
  let data = await readFile(path);
  let item = data.filter((item) => item.imdbID === id);
  return item;
};
const getByIDAndUpdate = async (path, id, data) => {
  let dataArray = await readFile(path);
  let updatedData = dataArray.map(
    (item) => (item.imdbID === id && { ...data, imdbID: id }) || item
  );
  let write = await fsExtra.writeJson(path, updatedData);
  return updatedData;
};
const remove = async (path, id) => {
  let dataArray = await readFile(path);
  dataArray = dataArray.filter((item) => item.imdbID !== id);
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
};
