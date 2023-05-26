import { ethers } from "hardhat";

async function main() {

  const Ethernity = await ethers.getContractFactory("Ethernity");
  const ethernity = await Ethernity.deploy();

  await ethernity.deployed();

  console.log("Ethernity deployed to:", ethernity.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
