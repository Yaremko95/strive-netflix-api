const express = require("express");
const cors = require("cors");
const mediaRouter = require("./media");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/media", mediaRouter);

const port = process.env.PORT;

app.listen(port, () => console.log(`Running on port ${port}`));
