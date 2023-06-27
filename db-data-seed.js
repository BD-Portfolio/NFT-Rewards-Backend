const { connectMongoDB, insertUsers } = require("./database/mongodb");
const { initializeUserList } = require("./utils/users-utilities");
require("dotenv").config();

const seedDB = async () => {

  try {

    // connect to mongodb
    await connectMongoDB();

    // initialize 50 users
    const users = await initializeUserList();

    // insert 50 users data in the mongodb
    await insertUsers(users);

    process.exit(0);

  } catch (error) {
    console.log("Failed to insert data in DB : ", error);
    process.exit(0);
  }

}

seedDB();