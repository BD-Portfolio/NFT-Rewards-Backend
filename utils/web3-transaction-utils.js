const { EthNodeConnection } = require("./eth-node-connection");

const createRewardNftMetadata = (uuid, nftId, userId, transactionHash) => {
  return {
    nftUuid: uuid,
    nftId: nftId,
    userId: userId,
    transactionHash: transactionHash,
    nftImage: getImageForNft()
  };
}

const createRewardTransaction = async (
  sender,
  receiver,
  imageUrl,
  contract,
  contractAddress,
  privateKey
) => {

  try {

    const web3 = EthNodeConnection.getEthNodeConnection();

    // calculate gas limit for the mint transaction
    const gasLimit = await contract.methods
      .reward(receiver, imageUrl)
      .estimateGas({
        from: sender
      });

    // adding 20% buffer to the gas limit for executing transaction fast
    const bufferedGasLimit = Math.round(
      Number(gasLimit) + (Number(gasLimit) * Number(0.2))
    );

    // encode the function with abi
    const encodedData = contract.methods
      .reward(receiver, imageUrl)
      .encodeABI();

    // fetch current gas price
    const gasPrice = await web3.eth.getGasPrice();

    // calculating total transaction fee
    const transactionFee = Number(gasPrice) * Number(bufferedGasLimit);

    // fetch ETH balance of user account
    const balanceInWei = await web3.eth.getBalance(sender);

    if (transactionFee <= Number(balanceInWei)) {

      // create transaction object
      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: contractAddress,
        data: encodedData,
        from: sender
      };

      // sign transaction using private key
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

      console.log("Transaction hash: ", signedTx.transactionHash);
      console.log("Waiting for transaction to get confirmed...");

      // send the signed transaction
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      return {
        status: true,
        hash: signedTx.transactionHash
      }

    } else {
      return {
        status: false,
        message: "User account doesn't have enough ETH to pay transaction fee"
      }
    }

  } catch (error) {
    console.log("Error in reward transaction: ", error);
    return {
      status: false,
      message: "Exception occured"
    }
  }

}

// function to connect to smart contract
const connectToContract = (web3, abi, contractAddress) => {
  try {
    return new web3.eth.Contract(abi, contractAddress);
  } catch (error) {
    console.log("Error in creating instance of contract: ", error);
    return null;
  }
}

// Method to fetch random image for a NFT 
// Assuming having 5 images and randomly anyone will be picked
// But in production unique images will be there for each NFT ID
const getImageForNft = () => {
  const min = 1;
  const max = 5;
  const id = Math.floor(Math.random() * (max - min + 1) + min);
  let url;
  switch (id) {
    case 1:
      url = "https://img.freepik.com/free-photo/bird-colorful-colorful-flowers-generative-ai_206725-752.jpg";
      break;
    case 2:
      url = "https://img.freepik.com/free-photo/landscape-shot-beautiful-cholatse-mountains-body-water-khumbu-nepal_181624-24825.jpg";
      break;
    case 3:
      url = "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg";
      break;
    case 4:
      url = "https://img.freepik.com/free-photo/green-field-tree-blue-skygreat-as-backgroundweb-banner-generative-ai_1258-153069.jpg?size=626&ext=jpg";
      break;
    case 5:
      url = "https://img.freepik.com/free-photo/fog-dark-clouds-mountains_1204-503.jpg";
      break;
    default:
      url = "https://img.freepik.com/free-photo/bird-colorful-colorful-flowers-generative-ai_206725-752.jpg";
      break;
  }
  return url;
}

module.exports = {
  createRewardNftMetadata, createRewardTransaction, connectToContract, getImageForNft
};
