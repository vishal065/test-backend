import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`, {
      dbName: "CMPB",
    });
    console.log("connected to database");
    // console.log(connection);
    // console.log(connection?.connection);
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};

export default dbConnect;
