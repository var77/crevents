//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import './Event.sol';

// Contract for creating and managing events
contract EventCreator is Ownable {
  // The fee that will be paid from event contract
  uint8 public fee = 1;

  // The server used to get the token URI for an event
  string public tokenUriServer = 'https://metadata.crevents.xyz/';

  // An array of all the event contract addresses created by this contract
  address[] public events;

  // Event emitted when an event is created
  event EventCreated(address addr);

  // Event emitted when fee is received
  event Received(address, uint);

  // Function for creating a new event contract
  function createEvent(
    Utils.EventStruct calldata _eventData
  ) external returns (address) {
    // Create a new Event contract with the given data and the sender's address and fee
    address eventContractAddress = address(
      new Event(_eventData, msg.sender, fee)
    );

    // Add the new event contract's address to the events array
    events.push(eventContractAddress);

    // Emit an EventCreated event with the new event contract's address
    emit EventCreated(eventContractAddress);

    // Return the new event contract's address
    return eventContractAddress;
  }

  // Function for withdrawing the contract's balance, only callable by the contract owner
  function withdraw() external onlyOwner {
    // Get the current balance of the contract
    uint256 contractBalance = address(this).balance;

    // If the contract balance is 0, throw an exception
    if (contractBalance == 0) revert TransferFailed();

    bool success = false;
    // Transfer the contract balance to the owner
    (success, ) = payable(owner()).call{value: contractBalance}('');

    if (!success) revert TransferFailed();
  }

  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

  // Function for changing the token URI server, only callable by the contract owner
  function setTokenUri(string memory uri) external onlyOwner {
    // Set the new token URI server
    tokenUriServer = uri;
  }

  // Function for getting an array of event info structs, with an offset, limit, and current timestamp
  function getEvents(
    uint256 offset,
    uint256 limit,
    uint256 currTimestamp
  ) external view returns (Utils.EventInfoStruct[] memory) {
    // Get the maximum length of the events array
    uint256 maxLen = events.length;

    // Initialize variables for the result array length, iteration limit, and reversed index
    uint256 arrLength;
    uint256 iterLimit;
    uint256 reversedIndex;

    // Determine the length of the result array based on the offset and limit
    if (offset >= maxLen) {
      arrLength = 0;
    } else if ((maxLen - offset) < limit) {
      arrLength = maxLen - offset;
    } else {
      arrLength = limit;
    }

    // Create an array for the result event info structs
    Utils.EventInfoStruct[] memory res = new Utils.EventInfoStruct[](arrLength);

    // If the result array length is 0, return the empty array
    if (arrLength == 0) return res;

    // Determine the iteration limit for populating the result array
    iterLimit = maxLen - arrLength;

    // Determine the reversed index for populating the result array
    if (arrLength > 0) {
      reversedIndex = arrLength - 1;
    }

    // Iterate through the events array in reverse order, and populate the result array with the event info structs
    uint256 i = reversedIndex;

    while (true) {
      Event evt = Event(events[i]);
      res[reversedIndex - i] = evt.getEventInfo(currTimestamp);

      if (reversedIndex - i == arrLength - 1 || i == 0) break;

      i--;
    }

    return res;
  }
}
