// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    // Struct to represent a single transaction
    struct Transaction {
        address sender;     // Address of the sender
        address receiver;   // Address of the receiver
        string senderEmail;
        string receiverEmail;
        uint256 amount;     // Amount of the transaction
        uint256 timestamp;  // Timestamp of the transaction
    }

    // Array to store all transactions
    Transaction[] public transactions;

    // Function to add a new transaction
    function addTransaction(
        address _receiver,
        uint256 _amount,
        string calldata _senderEmail,
        string calldata _receiverEmail
    ) public {
        require(_receiver != address(0), "Invalid receiver address");
        require(
            keccak256(abi.encodePacked(_senderEmail)) != keccak256(abi.encodePacked(_receiverEmail)),
            "You cannot transfer money to yourself"
        );
        require(_amount > 0, "Invalid amount");

        Transaction memory newTransaction = Transaction({
            sender: msg.sender,
            receiver: _receiver,
            amount: _amount,
            senderEmail: _senderEmail,
            receiverEmail: _receiverEmail,
            timestamp: block.timestamp
        });

        transactions.push(newTransaction);
    }

    // Function to get the total number of transactions
    function getTotalTransactions() public view returns (uint256) {
        return transactions.length;
    }

    // Function to get a specific transaction by index
    function getTransaction(uint256 _index) public view returns (
        address sender,
        address receiver,
        uint256 amount,
        uint256 timestamp
    ) {
        require(_index < transactions.length, "Index out of bounds");

        Transaction memory transaction = transactions[_index];
        return (transaction.sender, transaction.receiver, transaction.amount, transaction.timestamp);
    }
}
