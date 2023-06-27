// execute this cron in every 1 minute just for testing
// in production, it will run once in a month
const cron = require("node-cron");
const { uuid } = require("uuidv4");
const { findTopTenUsers } = require("../database/mongodb");
const { rewardContractAbi } = require("../utils/reward-nft-abi");
const { connectToContract, createRewardTransaction } = require("../utils/web3-transaction-utils");
const EventEmitter = require("events");
const { getTxLogs } = require("../events/reward-event-listener");
const { EthNodeConnection } = require("../utils/eth-node-connection");

let isCronExecuted = false;

// event to be fired on every successfull NFT reawrded from smart contract
const rewardTxEvent = new EventEmitter();

// Creating a cron job which runs on every 1 min
const rewardDistributor = cron.schedule("*/1 * * * *", async function () {

  // once the cron is executed return
  if (isCronExecuted) {
    return;
  } else {
    isCronExecuted = true;
  }

  try {

    const web3 = EthNodeConnection.getEthNodeConnection();

    const contractAddress = process.env.REWARD_NFT_CONTRACT_ADDRESS;
    const adminWalletAddress = process.env.ADMIN_ETHEREUM_ACCOUNT_WALLET_ADDRESS;
    const adminPrivateKey = process.env.ADMIN_ETHEREUM_ACCOUNT_PRIVATE_KEY;

    // create a instance of reward nft contract
    const contract = connectToContract(web3, rewardContractAbi, contractAddress);

    // fetch all users who will be rewarded
    const users = await findTopTenUsers();

    let nftUuid;

    // loop through each user
    for (let index = 0; index < users.length; index++) {

      console.log(`Reward ${index+1} processing...`);

      // generate uuid for each nft
      nftUuid = uuid();

      // do reward nft transaction from smart contract
      const tx = await createRewardTransaction(
        adminWalletAddress,
        users[index].wallet,
        `http://localhost:${process.env.PORT}/reward-app/nft/data/${nftUuid}`,
        contract,
        contractAddress,
        adminPrivateKey
      );

      if (tx.status) {
        console.log(`Reward tx successful with tx hash : https://sepolia.etherscan.io/tx/${tx.hash}`);
        // emit the event that nft transaction is successful
        rewardTxEvent.emit("nftRewarded", {
          userId: users[index].userId,
          nftUuid: nftUuid,
          wallet: users[index].wallet,
          hash: tx.hash
        });
      } else {
        console.log("Reward transaction failed because " + tx.message);
      }

    }

  } catch (error) {
    errorLogger.error(`Failed to execute reward cron scheduler -> ${error}`);
  }

});

rewardTxEvent.on('nftRewarded', getTxLogs);

module.exports = { rewardDistributor };