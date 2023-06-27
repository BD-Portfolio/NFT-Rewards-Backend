const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { router } = require("./routes/reward-route");
const { rewardDistributor } = require("./crons/reward-cron-scheduler");
const { connectMongoDB } = require("./database/mongodb");
const { EthNodeConnection } = require("./utils/eth-node-connection");
require("dotenv").config();

const app = express();

// cors setting for frontend application
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, DELETE, PATCH"
}

// handles resource not found
const resourceNotFound = (req, res) => {
  res.status(404).json({ "message": "Resource not found!" });
  res.data = { "message": "Resource not found!" };
  return res;
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/reward-app', router);

// handles resource not found
app.use(resourceNotFound);

app.listen(`${process.env.PORT}`, async () => {
  try {
    console.log(`Listening on port : ${process.env.PORT}`);
    await connectMongoDB();
    EthNodeConnection.setEthNodeConnection(`${process.env.SEPOLIA_NODE_URL}`);
    console.log("Waiting for 1 minute to let execute cron for reward distribution...");
    rewardDistributor;
  } catch (error) {
    console.log(`Listening on port ${process.env.PORT} failed : ${error}`);
  }
});