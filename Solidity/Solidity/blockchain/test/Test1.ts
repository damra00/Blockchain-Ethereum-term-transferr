import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test1", function () {
  async function deployTestFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const [owner, user1, user2] = await ethers.getSigners();
    const date = (await time.latest()) + ONE_YEAR_IN_SECS;
    const Ethernity = await ethers.getContractFactory("Ethernity");
    const ethernity = await Ethernity.deploy();
    return { ethernity, date, owner, user1, user2 };
  }
  describe("check date", function () {
    it("Should return false if called too soon", async function () {
      const { ethernity, date } = await loadFixture(deployTestFixture);
      expect(await ethernity.checkDate(date)).to.be.false;
    });
    it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
      const { ethernity, date } = await loadFixture(deployTestFixture);
      await time.increaseTo(date);
      expect(await ethernity.checkDate(date)).to.be.true;
    });
    it("Shouldn't fail if the unlockTime has passed and the owner calls it", async function () {
      const { ethernity, date } = await loadFixture(deployTestFixture);
      await time.increaseTo(date + 24 * 60 * 60);
      expect(await ethernity.checkDate(date)).to.be.true;
    });
  });
  describe("show income", function () {
    it("Should return an empty list at the beginning", async function () {
      const { ethernity } = await loadFixture(deployTestFixture);
      expect(await ethernity.showIncome()).to.be.empty;
    });
    it("Should return a list with the transaction when someone transfers eth", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transfer(user2.address, date, {
        value: ethers.utils.parseEther("1.0"),
      });
      const transaction = await ethernity.connect(user2).showIncome();
      expect(transaction[0].adress).to.be.equal(user1.address);
      expect(transaction[0].date).to.be.equal(date);
      expect(transaction[0].balance).to.be.equal(
        ethers.utils.parseEther("1.0")
      );
    });
  });
  describe("show outcome", function () {
    it("Should return an empty list at the beginning", async function () {
      const { ethernity } = await loadFixture(deployTestFixture);
      expect(await ethernity.showOutcome()).to.be.empty;
    });
    it("Should return a list with the transaction when someone transfers eth", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transfer(user2.address, date, {
        value: ethers.utils.parseEther("1.0"),
      });
      const transaction = await ethernity.connect(user1).showOutcome();
      expect(transaction[0].adress).to.be.equal(user2.address);
      expect(transaction[0].date).to.be.equal(date);
      expect(transaction[0].balance).to.be.equal(
        ethers.utils.parseEther("1.0")
      );
    });
  });
});
