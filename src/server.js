const express = require("express");
const cors = require("cors");
const mediaRouter = require("./media");
const reviewsRouter = require("./reviews");
const app = express();

const whitelist =
  process.env.NODE_ENV === "production"
    ? [process.env.FE_URL_PROD]
    : [process.env.FE_URL_DEV];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/media", mediaRouter);
app.use("/reviews", reviewsRouter);

const port = process.env.PORT;

app.listen(port, () => console.log(`Running on port ${port}`));
