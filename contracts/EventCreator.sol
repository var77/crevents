//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Event.sol";

contract EventCreator is Ownable {
    address[] public events;
    uint256 public fee = 1;
    event EventCreated(address addr);

    function createEvent(Utils.EventStruct calldata _eventData) external returns(address) {
        address eventContractAddress = address(new Event(_eventData, msg.sender, fee));
        events.push(eventContractAddress);
        emit EventCreated(eventContractAddress);
        return eventContractAddress;
    }

    // whithdraw contract balance
    function withdraw() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        if (contractBalance == 0)
            revert TransferFailed();

        payable(owner()).transfer(contractBalance);
    }
}
