const express = require("express");
require("dotenv").config();
const routes = require("./routes");

const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(routes);

app.listen(PORT, () => logger.info(`app listening port ${PORT}`));
