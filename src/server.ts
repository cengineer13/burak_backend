import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";

mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then((data) => {
    console.log("MongoDB connected succesfully!");
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, function () {
      console.info(
        `The server is running succesfully on port: https://localhost:${PORT}`,
      );
    });
  })
  .catch((err) => console.log("ERROR on connection Mongo DB ", err));
