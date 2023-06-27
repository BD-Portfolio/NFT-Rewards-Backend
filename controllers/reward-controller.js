const {
  fetchUserRankDetail,
  fetchUserNftDetails,
  fetchUserNftDetailsByNftId,
  fetchAllNftDetails,
  fetchAllUserDetails
} = require("../services/reward-service");

const getUserDetailsById = async (req, res) => {
  const response = await fetchUserRankDetail(req);
  res.status(response.httpStatus).json(response);
}

const getNftDetailsById = async (req, res) => {
  const response = await fetchUserNftDetails(req);
  res.status(response.httpStatus).json(response);
}

const getNftDetailsByNftId = async (req, res) => {
  const response = await fetchUserNftDetailsByNftId(req);
  res.status(response.httpStatus).json(response);
}

const getAllNftDetails = async (req, res) => {
  const response = await fetchAllNftDetails(req);
  res.status(response.httpStatus).json(response);
}

const getAllUserDetails = async (req, res) => {
  const response = await fetchAllUserDetails(req);
  res.status(response.httpStatus).json(response);
}

module.exports = { getUserDetailsById, getNftDetailsById, getAllNftDetails, getAllUserDetails, getNftDetailsByNftId }

