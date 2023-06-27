const { findUserById, findAllUsers, findNftDetailsByNftId,
  findAllNftDetails, findNftDetailsByUserId } = require("../database/mongodb");

const fetchUserNftDetails = async (req) => {

  try {

    const { userId } = req.params;

    if (!userId) {
      return {
        "httpStatus": 400,
        "message": "User ID is mandatory",
        "data": null,
        "error": null,
      }
    }

    const nftDetails = await findNftDetailsByUserId(userId);

    if (!nftDetails.length) {
      return {
        "httpStatus": 400,
        "message": "NFT details not found",
        "data": null,
        "error": null,
      }
    } else {
      for (let index = 0; index < nftDetails.length; index++) {
        nftDetails[index].transactionHash = "https://sepolia.etherscan.io/tx/" + nftDetails[index].transactionHash;
      }
      return {
        "httpStatus": 200,
        "message": "NFT details found",
        "data": nftDetails,
        "error": null,
      }
    }

  } catch (error) {
    console.log(`Failed to fetch NFT details of user id ${req.params.userId} : ${error} `);
    return {
      "httpStatus": 500,
      "message": "Internal Server Error",
      "data": null,
      "error": error,
    }
  }

}

const fetchUserNftDetailsByNftId = async (req) => {

  try {

    const { nftId } = req.params;

    if (!nftId) {
      return {
        "httpStatus": 400,
        "message": "NFT ID is mandatory",
        "data": null,
        "error": null,
      }
    }

    const nftDetails = await findNftDetailsByNftId(nftId);

    if (!nftDetails) {
      return {
        "httpStatus": 400,
        "message": "NFT details not found",
        "data": null,
        "error": null,
      }
    } else {
      nftDetails.transactionHash = "https://sepolia.etherscan.io/tx/" + nftDetails.transactionHash;
      return {
        "httpStatus": 200,
        "message": "NFT details found",
        "data": nftDetails,
        "error": null,
      }
    }

  } catch (error) {
    console.log(`Failed to fetch NFT details of nft id ${req.params.nftId} : ${error} `);
    return {
      "httpStatus": 500,
      "message": "Internal Server Error",
      "data": null,
      "error": error,
    }
  }

}

const fetchUserRankDetail = async (req) => {

  try {

    const { userId } = req.params;

    if (!userId) {
      return {
        "httpStatus": 400,
        "message": "User ID is mandatory",
        "data": null,
        "error": null,
      }
    }

    const userDetail = await findUserById(userId);

    if (!userDetail) {
      return {
        "httpStatus": 400,
        "message": "User ID not found",
        "data": null,
        "error": null,
      }
    } else {
      return {
        "httpStatus": 200,
        "message": "User ID found",
        "data": userDetail,
        "error": null,
      }
    }

  } catch (error) {
    console.log(`Failed to fetch user details of id ${req.params.userId} : ${error} `);
    return {
      "httpStatus": 500,
      "message": "Internal Server Error",
      "data": null,
      "error": error,
    }
  }

}

const fetchAllNftDetails = async (req) => {

  try {

    const nftDetails = await findAllNftDetails();

    if (nftDetails.length) {
      return {
        "httpStatus": 200,
        "message": "NFT details found",
        "data": nftDetails,
        "error": null,
      }
    } else {
      for (let index = 0; index < nftDetails.length; index++) {
        nftDetails[index].transactionHash = "https://sepolia.etherscan.io/tx/" + nftDetails[index].transactionHash;
      }
      return {
        "httpStatus": 400,
        "message": "NFT details not found",
        "data": null,
        "error": null,
      }
    }

  } catch (error) {
    console.log("Failed to fetch NFT details", error);
    return {
      "httpStatus": 500,
      "message": "Internal Server Error",
      "data": null,
      "error": error,
    }
  }

}

const fetchAllUserDetails = async (req) => {

  try {

    const userDetails = await findAllUsers();

    if (userDetails.length) {
      return {
        "httpStatus": 200,
        "message": "User details found",
        "data": userDetails,
        "error": null,
      }
    } else {
      return {
        "httpStatus": 400,
        "message": "User details not found",
        "data": null,
        "error": null,
      }
    }

  } catch (error) {
    console.log("Failed to fetch user details", error);
    return {
      "httpStatus": 500,
      "message": "Internal Server Error",
      "data": null,
      "error": error,
    }
  }

}

module.exports = {
  fetchAllNftDetails,
  fetchAllUserDetails,
  fetchUserNftDetails,
  fetchUserRankDetail,
  fetchUserNftDetailsByNftId
};