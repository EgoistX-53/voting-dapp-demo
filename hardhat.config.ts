import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  }
};

export default config;
