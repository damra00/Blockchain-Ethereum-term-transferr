// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Ethernity is Ownable {
    mapping(address => transactionHistory) private balances;

    struct transactionHistory {
        transaction[] income;
        transaction[] outcome;
    }

    struct transaction {
        address adress;
        uint256 date;
        uint256 balance;
    }
    /** ---------------------------------------------------------------------------- */
    address[] private allAddress;

    function getAllAddress() public view onlyOwner returns (address[] memory) {
        return allAddress;
    }

    function updateAllAdress(address adr) private {
        for (uint i = 0; i < allAddress.length; i++) {
            if (allAddress[i] == adr) {
                return;
            }
        }
        allAddress.push(adr);
    }

    function incomeForAdmin(address adr)
        public
        view
        onlyOwner
        returns (transaction[] memory)
    {
        return balances[adr].income;
    }

    function outcomeForAdmin(address adr)
        public
        view
        onlyOwner
        returns (transaction[] memory)
    {
        return balances[adr].outcome;
    }

    /** ---------------------------------------------------------------------------- */

    // first transfer
    function transferEth(address to, uint256 date)
        public
        payable
        greaterThanZero
    {
        transactionHistory storage parent = balances[msg.sender];
        require(to != msg.sender, "You can not send Eth to yourself!");
        for (uint256 i = 0; i < parent.outcome.length; i++) {
            require(
                parent.outcome[i].adress != to,
                "Unique address control for transfer!"
            );
        }

        parent.outcome.push(transaction(to, date, msg.value));

        transactionHistory storage child = balances[to];
        child.income.push(transaction(msg.sender, date, msg.value));
        /** ---------------------------------------------------------------------------- */
        updateAllAdress(msg.sender);
        updateAllAdress(to);
        /** ---------------------------------------------------------------------------- */
    }

    function updateBalance(address to) public payable greaterThanZero {
        transactionHistory storage parent = balances[msg.sender];
        require(to != msg.sender, "Can not update your own balance!");
        for (uint256 i = 0; i < parent.outcome.length; i++) {
            if (parent.outcome[i].adress == to) {
                parent.outcome[i].balance += msg.value;
            }
        }
        transactionHistory storage child = balances[to];
        for (uint256 i = 0; i < child.income.length; i++) {
            if (child.income[i].adress == msg.sender) {
                child.income[i].balance += msg.value;
            }
        }
    }

    modifier greaterThanZero() {
        require(msg.value > 0, "Msg.value must be above zero!");
        _;
    }

    function withdrawChild(address from, uint256 amount) public {
        transactionHistory storage child = balances[msg.sender];
        for (uint256 i = 0; i < child.income.length; i++) {
            if (child.income[i].adress == from) {
                require(
                    amount <= child.income[i].balance,
                    "You can not withdraw more than the Eth received!(Child)"
                );
                require(checkDate(child.income[i].date), "Date Error!");
                payable(msg.sender).transfer(amount);
                child.income[i].balance -= amount;
                break;
            }
        }

        transactionHistory storage parent = balances[from];
        for (uint256 i = 0; i < parent.outcome.length; i++) {
            if (parent.outcome[i].adress == msg.sender) {
                parent.outcome[i].balance -= amount;
                break;
            }
        }
    }

    function withdrawParent(address to, uint256 amount) public {
        transactionHistory storage parent = balances[msg.sender];
        for (uint256 i = 0; i < parent.outcome.length; i++) {
            if (parent.outcome[i].adress == to) {
                require(
                    amount <= parent.outcome[i].balance,
                    "You cannot withdraw more than the Eth received!(Parent)"
                );
                payable(msg.sender).transfer(amount);
                parent.outcome[i].balance -= amount;
                break;
            }
        }

        transactionHistory storage child = balances[to];
        for (uint256 i = 0; i < child.income.length; i++) {
            if (child.income[i].adress == msg.sender) {
                child.income[i].balance -= amount;
                break;
            }
        }
    }

    function checkDate(uint256 date) public view returns (bool) {
        return (date >= block.timestamp);
    }

    /*    modifier olarak kullanmak istersek:
    modifier checkdate(uint date) {
        require(date >= block.timestamp,"You can't withdraw yet");
        _;
    }*/

    function showIncome() public view returns (transaction[] memory) {
        return balances[msg.sender].income;
    }

    function showTotalIncome() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < showIncome().length; i++) {
            sum += showIncome()[i].balance;
        }
        return sum;
    }

    function showOutcome() public view returns (transaction[] memory) {
        return balances[msg.sender].outcome;
    }

    function showTotalOutcome() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < showOutcome().length; i++) {
            sum += showOutcome()[i].balance;
        }
        return sum;
    }
}
