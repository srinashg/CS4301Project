pragma solidity ^0.8.21;

contract Bank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        // msg.sender is the address of the user calling this function
        // msg.value is the amount of Ether sent in the transaction
        balances[msg.sender] += msg.value;
    }
}
