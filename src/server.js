const express = require("express");
const cors = require("cors");
const mediaRouter = require("./media");
const reviewsRouter = require("./reviews");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/media", mediaRouter);
app.use("/reviews", reviewsRouter);

const port = process.env.PORT;

app.listen(port, () => console.log(`Running on port ${port}`));
