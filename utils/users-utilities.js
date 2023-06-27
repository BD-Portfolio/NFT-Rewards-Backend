const bip39 = require("bip39");
const { hdkey } = require("ethereumjs-wallet");
const { uuid } = require('uuidv4');

const wallet_hd_path = "m/44'/60'/0'/0/0";

// Method to generate ethereum wallet address for each user
const generateWallet = () => {
  const mnemonic = bip39.generateMnemonic(128).split(" ");
  const mnemonicInString = mnemonic.join(" ");
  const seed = bip39.mnemonicToSeedSync(mnemonicInString);
  const hdWallet = hdkey.fromMasterSeed(seed);
  const wallet = hdWallet.derivePath(wallet_hd_path).getWallet();
  return wallet.getAddressString();
}

// Method to create user details like name, age, score 
const createFakeUserDetails = () => {
  let userDetails = {};
  userDetails.userId = uuid();
  userDetails.age = generateUserAge();
  userDetails.gender = generateUserGender();
  userDetails.score = generateScoreForUser();
  userDetails.wallet = generateWallet();
  userDetails.rank = 0;
  return userDetails;
}

// Method to initialize user list with around 50 users list
const initializeUserList = async () => {
  let userList = [];
  for (let index = 0; index < 50; index++) {
    userList.push(createFakeUserDetails());
  }
  return await fetchTopScorerList(userList);
}

// Method to fetch top 10 score users with thier ranks
const fetchTopScorerList = async (userList) => {
  const sortedList = await sortUserBasedOnScore(userList);
  for (let index = 0; index < sortedList.length; index++) {
    sortedList[index].rank = index + 1;
  }
  return sortedList;
}

// Method to generate a score between a range 1 to 1000
const generateScoreForUser = () => {
  const min = 1;
  const max = 1000;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Method to generate user age between a range 24 to 60
const generateUserAge = () => {
  const min = 24;
  const max = 60;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Method to generate random gender for user [ Male or Female ]
const generateUserGender = () => {
  const min = 1;
  const max = 2;
  const id = Math.floor(Math.random() * (max - min + 1) + min);
  return id == 1 ? "Male" : "Female";
}

const sortUserBasedOnScore = async (userList) => {
  return await userList.sort((a, b) => b.score - a.score);
}

module.exports = { initializeUserList, fetchTopScorerList };