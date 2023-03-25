//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './Event.sol';

contract EventCreator is Ownable {
  uint8 public fee = 1;
  string public tokenUriServer = 'https://metadata.cryvents.xyz/';
  address[] public events;

  event EventCreated(address addr);

  function createEvent(
    Utils.EventStruct calldata _eventData
  ) external returns (address) {
    address eventContractAddress = address(
      new Event(_eventData, msg.sender, fee)
    );
    events.push(eventContractAddress);
    emit EventCreated(eventContractAddress);
    return eventContractAddress;
  }

  // whithdraw contract balance
  function withdraw() external onlyOwner {
    uint256 contractBalance = address(this).balance;
    if (contractBalance == 0) revert TransferFailed();

    payable(owner()).transfer(contractBalance);
  }

  // change tokenUriServer
  function setTokenUri(string memory uri) external onlyOwner {
    tokenUriServer = uri;
  }

  // getting events with offset, limit in reversed order
  function getEvents(
    uint256 offset,
    uint256 limit,
    uint256 currTimestamp
  ) external view returns (Utils.EventInfoStruct[] memory) {
    uint256 maxLen = events.length;
    uint256 arrLength;
    uint256 iterLimit;
    uint256 reversedIndex;

    // getting the length for result array
    if (offset >= maxLen) {
      arrLength = 0;
    } else if ((maxLen - offset) < limit) {
      arrLength = maxLen - offset;
    } else {
      arrLength = limit;
    }

    Utils.EventInfoStruct[] memory res = new Utils.EventInfoStruct[](arrLength);

    if (arrLength == 0) return res;

    // getting the max iteration index
    iterLimit = maxLen - arrLength;

    // getting reversed index
    if (arrLength > 0) {
      reversedIndex = arrLength - 1;
    }

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
