// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    mapping(address => uint256) private balance;

    constructor() {
        // Perform initialization if needed
        // For example, you can set initial balances for specific addresses
        balance[msg.sender] = 1000; // Initialize the balance of the contract deployer
    }

    function deposit(uint256 amount) public payable {
        require(amount > 0, "Deposit amount must be greater than 0");
        balance[msg.sender] += amount;
    }

    function transfer(uint256 amount, address recipient) public {
        require(balance[msg.sender] >= amount, "Insufficient balance");
        balance[msg.sender] -= amount;
        payable(recipient).transfer(amount);
    }

    function withdraw(uint256 amount) public payable {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(balance[msg.sender] >= amount, "Insufficient balance");

        balance[msg.sender] -= amount;
    }

    function getBalance() public view returns (uint256) {
        return balance[msg.sender];
    }
}
