import mongoose from "mongoose";
import { MONGO_URL } from "../src/utils/config";

const connectToMongo: () => void = () => {
  if (MONGO_URL && !mongoose.connection.readyState)
    mongoose
      .connect(MONGO_URL)
      .then(() => console.log("Connected to MongoDB"))
      .catch((e) => console.log(`Could not connect to MongoDB ${e}`));
};

export default connectToMongo;
