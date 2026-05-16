import * as dotenv from "dotenv";
import { join } from "path";
import { Log, setLoggerToken } from "./logger";

dotenv.config({ path: join(__dirname, "../.env") });

const token = process.env.EVALUATION_ACCESS_TOKEN || "";

console.log("Token loaded:", token.length > 0 ? "yes" : "no");

setLoggerToken(token);

async function testLogger() {
  const result = await Log(
    "backend",
    "info",
    "middleware",
    "logging middleware test completed"
  );

  console.log(result);
}

testLogger();