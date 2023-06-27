const mongoose = require("mongoose");
let User;
let Nft;

// method to connect to mongodb
const connectMongoDB = async () => {

  try {

    await mongoose.connect(`${process.env.MONGODB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to mongodb...");

    User = mongoose.model("User", userSchema);
    Nft = mongoose.model("Nft", nftSchema);

  } catch (error) {
    console.log(`Error in connecting mongodb : ${error}`);
  }

}

// method to insert users in bulk in db
const insertUsers = async (userDetails) => {
  try {
    await User.insertMany(userDetails);
    console.log("User data stored in mongodb...");
  } catch (error) {
    console.log(`Error in storing users in mongodb : ${error}`);
  }
}

// method to fetch all users from the db
const findAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log(`Error in fetching users from mongodb : ${error}`);
    return [];
  }
}

// method to fetch users having rank 1 to 10
const findTopTenUsers = async () => {
  try {
    const users = await User.find().sort({ rank: 1 }).limit(10);
    return users;
  } catch (error) {
    console.log(`Error in fetching top 10 users from mongodb : ${error}`);
    return [];
  }
}

// method to fetch user by user id
const findUserById = async (id) => {
  try {
    const user = await User.findOne({ userId: id });
    return user;
  } catch (error) {
    console.log(`Error in fetching user by id from mongodb : ${error}`);
    return null;
  }
}

// method to fetch all the nft details
const findAllNftDetails = async () => {
  try {
    const nfts = await Nft.find();
    return nfts;
  } catch (error) {
    console.log(`Error in fetching nfts from mongodb : ${error}`);
    return [];
  }
}

// method to fetch all nft's owned by user id
const findNftDetailsByUserId = async (userId) => {
  try {
    const nftData = await Nft.find({ userId: userId });
    return nftData;
  } catch (error) {
    console.log(`Error in fetching nft data from mongodb : ${error}`);
    return [];
  }
}

// method to fetch nft data by nft id
const findNftDetailsByNftId = async (nftId) => {
  try {
    const nftData = await Nft.findOne({ nftId: nftId });
    return nftData;
  } catch (error) {
    console.log(`Error in fetching nft data from mongodb : ${error}`);
    return null;
  }
}

// method to insert nft details in th db
const insertNftDetails = async (nftDetails) => {
  try {
    const nft = new Nft(nftDetails);
    await nft.save();
    console.log("NFT data stored in mongodb...");
  } catch (error) {
    console.log(`Error in storing NFT data in mongodb : ${error}`);
  }
}

const userSchema = {
  userId: String,
  age: Number,
  gender: String,
  score: Number,
  wallet: String,
  rank: Number
};

const nftSchema = {
  nftUuid: String,
  userId: String,
  nftId: Number,
  transactionHash: String,
  nftImage: String
};

module.exports = {
  connectMongoDB, mongoose, insertUsers, findAllUsers, findUserById, findNftDetailsByNftId,
  findAllNftDetails, findNftDetailsByUserId, insertNftDetails, findTopTenUsers
};