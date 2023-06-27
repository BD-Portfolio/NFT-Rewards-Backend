const express = require("express");
const {
  getUserDetailsById,
  getNftDetailsById,
  getAllUserDetails,
  getAllNftDetails,
  getNftDetailsByNftId
} = require("../controllers/reward-controller");

const router = express.Router();

router.get('/user/:userId', getUserDetailsById);

router.get('/nft/data/:nftId', getNftDetailsByNftId);

router.get('/nft/:userId', getNftDetailsById);

router.get('/user-list', getAllUserDetails);

router.get('/nft-list', getAllNftDetails);

module.exports = { router };