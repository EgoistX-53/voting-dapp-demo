import { ethers } from "hardhat";

async function main() {
    const Voting = await ethers.getContractFactory("Voting");

    console.log("Deploying Voting contract...");
    const candidates = ["Alice", "Bob", "Charlie"];
    const voting = await Voting.deploy(candidates);
    // await voting.deployed();

    console.log(`Voting contract deployed to: ${voting.target}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });