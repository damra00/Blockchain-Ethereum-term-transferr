import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test1", function () {
  async function deployTestFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const [owner, user1, user2, user3] = await ethers.getSigners();
    const date = (await time.latest()) + ONE_YEAR_IN_SECS;
    const Ethernity = await ethers.getContractFactory("Ethernity");
    const ethernity = await Ethernity.deploy();
    return { ethernity, date, owner, user1, user2, user3 };
  }
  describe("Function: Check Date", function () {
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
  describe("Function: Show Income", function () {
    it("Should return an empty list at the beginning", async function () {
      const { ethernity } = await loadFixture(deployTestFixture);
      expect(await ethernity.showIncome()).to.be.empty;
    });
    it("Should return a list with the transaction when someone transfers eth", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
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
  describe("Function: Show Outcome", function () {
    it("Should return an empty list at the beginning", async function () {
      const { ethernity } = await loadFixture(deployTestFixture);
      expect(await ethernity.showOutcome()).to.be.empty;
    });
    it("Should return a list with the transaction when someone transfers eth", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
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
  /* --Total Income, --Total Outcome, --WithdrawParent, --WithdrawChild, --UpdateBalance, --Transfer */
  describe("Function: Show Total Income", function () {
    it("Should return Zero at the beginning.", async function () {
      const { ethernity } = await loadFixture(deployTestFixture);
      expect(await ethernity.showTotalIncome()).equal(0);
    });
    it("Should return a number that is equal to parsed Eth", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("1.0"),
      });
      const transaction = await ethernity.connect(user2).showTotalIncome();
      expect(transaction).to.be.equal(ethers.utils.parseEther("1.0"));
    });
  });
  describe("Function: Show Total Outcome", function () {
    it("Should return Zero at the beginning.", async function () {
      const { ethernity } = await loadFixture(deployTestFixture);
      expect(await ethernity.showTotalOutcome()).equal(0);
    });
    it("Should return a number that is equal to parsed Eth", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("1.0"),
      });
      const transaction = await ethernity.connect(user1).showTotalOutcome();
      expect(transaction).to.be.equal(ethers.utils.parseEther("1.0"));
    });
  });
  describe("Function: Update Balance", function () {
    it("Won't update balance if msg.value equals 0", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      try {
        await ethernity.connect(user1).transferEth(user2.address, date, {
          value: ethers.utils.parseEther("1.0"),
        });
        await ethernity.connect(user1).updateBalance(user2.address, {
          value: ethers.utils.parseEther("0"),
        });
      } catch (error) {
        console.log("\t\tCatch: msg.value equals 0 in Update Balance!!!");
      }
    });
    it("Won't update balance before first transfer.", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).updateBalance(user2.address, {
        value: ethers.utils.parseEther("1.0"),
      });
      const transaction = await ethernity.connect(user2).showIncome();
      const transaction2 = await ethernity.connect(user1).showOutcome();
      expect(transaction).to.be.empty;
      expect(transaction2).to.be.empty;
    });
    it("Update Balance after first transfer", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("1.0"),
      });
      await ethernity.connect(user1).updateBalance(user2.address, {
        value: ethers.utils.parseEther("1.0"),
      });
      const transaction = await ethernity.connect(user1).showOutcome();
      expect(transaction[0].adress).to.be.equal(user2.address);
      expect(transaction[0].date).to.be.equal(date);
      expect(transaction[0].balance).to.be.equal(
        ethers.utils.parseEther("2.0")
      );
      const transaction2 = await ethernity.connect(user2).showIncome();
      expect(transaction2[0].adress).to.be.equal(user1.address);
      expect(transaction2[0].date).to.be.equal(date);
      expect(transaction2[0].balance).to.be.equal(
        ethers.utils.parseEther("2.0")
      );
    });
  });
  describe("Function: Transfer", function () {
    it("Wrong Date", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      try {
        await ethernity.connect(user1).transferEth(user2.address, -1, {
          value: ethers.utils.parseEther("1.0"),
        });
      } catch (error) {
        console.log("\t\tCatch: Wrong date!!!");
      }
    });
    it("Negative transfer amount", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      try {
        await ethernity.connect(user1).transferEth(user2.address, date, {
          value: ethers.utils.parseEther("-1"),
        });
      } catch (error) {
        console.log("\t\tCatch: Negative transfer amount!!!!!!");
      }
    });
    it("Successful Transfer", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
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
  describe("Function: Withdraw Parent", function () {
    it("Successful Transfer to parent", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("2.0"),
      });
      await ethernity
        .connect(user1)
        .withdrawParent(user2.address, "1000000000000000000");
      const outcomeTransaction = await ethernity.connect(user1).showOutcome();
      expect(outcomeTransaction[0].adress).to.be.equal(user2.address);
      expect(outcomeTransaction[0].date).to.be.equal(date);
      expect(outcomeTransaction[0].balance).to.be.equal(
        ethers.utils.parseEther("1.0")
      );
      const incomeTransaction = await ethernity.connect(user2).showIncome();
      expect(incomeTransaction[0].adress).to.be.equal(user1.address);
      expect(incomeTransaction[0].date).to.be.equal(date);
      expect(incomeTransaction[0].balance).to.be.equal(
        ethers.utils.parseEther("1.0")
      );
    });
    it("another Person can not interact with the connection that already linked", async function () {
      const { ethernity, user1, user2, user3, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("2.0"),
      });

      try {
        await ethernity
          .connect(user3)
          .withdrawParent(user1.address, "1000000000000000000");
        const incomeTransaction = await ethernity.connect(user2).showIncome();
        expect(incomeTransaction[0].adress).to.be.equal(user1.address);
        expect(incomeTransaction[0].date).to.be.equal(date);
        expect(incomeTransaction[0].balance).to.be.equal(
          ethers.utils.parseEther("1.0")
        );
        const outcomeTransaction = await ethernity.connect(user1).showOutcome();
        expect(outcomeTransaction[0].adress).to.be.equal(user2.address);
        expect(outcomeTransaction[0].date).to.be.equal(date);
        expect(outcomeTransaction[0].balance).to.be.equal(
          ethers.utils.parseEther("1.0")
        );
      } catch (error) {
        console.log(
          "\t\tCatch: (withdrawParent) Another Person interaction error!!!"
        );
      }
    });
  });
  describe("Function: Withdraw Child", function () {
    it("Successful Transfer to child", async function () {
      const { ethernity, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("2.0"),
      });
      await time.increaseTo(date);
      await ethernity
        .connect(user2)
        .withdrawChild(user1.address, "1000000000000000000");
      const incomeTransaction = await ethernity.connect(user2).showIncome();
      expect(incomeTransaction[0].adress).to.be.equal(user1.address);
      expect(incomeTransaction[0].date).to.be.equal(date);
      expect(incomeTransaction[0].balance).to.be.equal(
        ethers.utils.parseEther("1.0")
      );
      const outcomeTransaction = await ethernity.connect(user1).showOutcome();
      expect(outcomeTransaction[0].adress).to.be.equal(user2.address);
      expect(outcomeTransaction[0].date).to.be.equal(date);
      expect(outcomeTransaction[0].balance).to.be.equal(
        ethers.utils.parseEther("1.0")
      );
    });
    it("another Person can not interact with the connection that already linked", async function () {
      const { ethernity, user1, user2, user3, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("2.0"),
      });
      await time.increaseTo(date);
      try {
        await ethernity
          .connect(user3)
          .withdrawChild(user1.address, "1000000000000000000");
        const incomeTransaction = await ethernity.connect(user2).showIncome();
        expect(incomeTransaction[0].adress).to.be.equal(user1.address);
        expect(incomeTransaction[0].date).to.be.equal(date);
        expect(incomeTransaction[0].balance).to.be.equal(
          ethers.utils.parseEther("1.0")
        );
        const outcomeTransaction = await ethernity.connect(user1).showOutcome();
        expect(outcomeTransaction[0].adress).to.be.equal(user2.address);
        expect(outcomeTransaction[0].date).to.be.equal(date);
        expect(outcomeTransaction[0].balance).to.be.equal(
          ethers.utils.parseEther("1.0")
        );
      } catch (error) {
        console.log(
          "\t\tCatch: (withdrawChild) Another Person interaction error!!!"
        );
      }
    });
  });
  describe("Function: Admin Operations", function () {
    it("Return an empty list at the beginning", async function () {
      const { ethernity, owner, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      const resultIncome = await ethernity
        .connect(owner)
        .incomeForAdmin(user1.address);
      const resultOutcome = await ethernity
        .connect(owner)
        .outcomeForAdmin(user1.address);
      expect(resultIncome).to.be.empty;
      expect(resultOutcome).to.be.empty;
    });
    it("Successful Income Operation", async function () {
      const { ethernity, owner, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("2.0"),
      });
      await time.increaseTo(date);

      const incomeTransaction = await ethernity
        .connect(owner)
        .incomeForAdmin(user2.address);
      expect(incomeTransaction[0].adress).to.be.equal(user1.address);
      expect(incomeTransaction[0].date).to.be.equal(date);
      expect(incomeTransaction[0].balance).to.be.equal(
        ethers.utils.parseEther("2.0")
      );
    });
    it("Successful Outcome Operation", async function () {
      const { ethernity, owner, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("2.0"),
      });
      await time.increaseTo(date);

      const outcomeTransaction = await ethernity
        .connect(owner)
        .outcomeForAdmin(user1.address);
      expect(outcomeTransaction[0].adress).to.be.equal(user2.address);
      expect(outcomeTransaction[0].date).to.be.equal(date);
      expect(outcomeTransaction[0].balance).to.be.equal(
        ethers.utils.parseEther("2.0")
      );
    });
    it("Another user can not interact with the contract for income", async function () {
      const { ethernity, owner, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("2.0"),
      });
      await time.increaseTo(date);
      try {
        const incomeTransaction = await ethernity
          .connect(user1)
          .incomeForAdmin(user2.address);
        expect(incomeTransaction[0].adress).to.be.equal(user1.address);
        expect(incomeTransaction[0].date).to.be.equal(date);
        expect(incomeTransaction[0].balance).to.be.equal(
          ethers.utils.parseEther("2.0")
        );
      } catch (error) {
        console.log("\t\tCatch: Admin rights error!!!");
      }
    });
    it("Another user can not interact with the contract for outcome", async function () {
      const { ethernity, owner, user1, user2, date } = await loadFixture(
        deployTestFixture
      );
      await ethernity.connect(user1).transferEth(user2.address, date, {
        value: ethers.utils.parseEther("2.0"),
      });
      await time.increaseTo(date);
      try {
        const incomeTransaction = await ethernity
          .connect(user1)
          .outcomeForAdmin(user2.address);
        expect(incomeTransaction[0].adress).to.be.equal(user1.address);
        expect(incomeTransaction[0].date).to.be.equal(date);
        expect(incomeTransaction[0].balance).to.be.equal(
          ethers.utils.parseEther("2.0")
        );
      } catch (error) {
        console.log("\t\tCatch: Admin rights error!!!");
      }
    });
  });
});
