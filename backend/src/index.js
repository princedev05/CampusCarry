import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./db/index.js";
import { initializeTokenPool } from "./controllers/token.controllers.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
  .then(async () => {
    // Initialize token pool after database connection
    await initializeTokenPool();

    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err)
    process.exit(1)
  })