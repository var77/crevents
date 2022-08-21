//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

library Utils {
    struct EventStruct {
        string name;
        string description;
        string link;
        uint256 maxParticipants;
        uint256 registrationEnd;
        uint256 start;
        uint256 end;
        uint256 ticketPrice;
        uint256 preSaleTicketPrice;
    }
}

error EventNotStarted();
error RegistrationClosed();
error EventAlreadyStarted();
error EventWasEnded();
error AddressNotWhitelisted();
error ParticipandNotFound();
error NoSeatsAvailable();
error ProvideRequiredArguments();
error ValueNotEnough();
error AlreadyRegistered();
error NotRegistered();
error CheckInNotAvailable();
error AlreadyCheckedIn();
error NotModerator();
error TransferFailed();

contract Event is Ownable {
    bool public onlyWhitelistRegistration;
    bool public registrationOpen = true;

    uint256 public maxParticipants;
    uint256 public registrationEnd;
    uint256 public start;
    uint256 public end;
    uint256 public registeredParticipantCount;
    uint256 public checkedParticipantCount;
    uint256 public ticketPrice;
    uint256 public preSaleTicketPrice;
    uint256 public parentContractFee;

    bytes32 public whitelistRoot = 0x16d95910a21726a3e7b59a8c6166b355396434419809cb902e2063555b8d60de;

    string public name;
    string public description;
    string public link;

    mapping(address => bool) public participants;
    mapping(address => bool) public checkedParticipants;
    mapping(address => bool) public moderators;

    event ParticipantRegistered(address participant);
    event ParticipantChecked(address participant);

    address public parentContractAddr;

    constructor(Utils.EventStruct memory eventData, address owner, uint256 fee) {        
        if (eventData.maxParticipants == 0 || eventData.start == 0 || eventData.end == 0) {
            revert ProvideRequiredArguments();
        }

        name = eventData.name;
        description = eventData.description;
        link = eventData.link;
        maxParticipants = eventData.maxParticipants;
        start = eventData.start;
        end = eventData.end;
        ticketPrice = eventData.ticketPrice;
        preSaleTicketPrice = eventData.preSaleTicketPrice;

        if (eventData.registrationEnd == 0) {
            registrationEnd = eventData.start;
        } else {
            registrationEnd = eventData.registrationEnd;
        }

        parentContractAddr = msg.sender;
        parentContractFee = fee;

        transferOwnership(owner);
    }

    modifier isRegistrationOpen() {
        uint256 currTimestamp = block.timestamp;
        console.log("Time %s %s", currTimestamp, start);
        if (currTimestamp > start)
            revert EventAlreadyStarted();
        if (!registrationOpen || currTimestamp > registrationEnd)
            revert RegistrationClosed();
        if (participants[msg.sender])
            revert AlreadyRegistered();
        if (registeredParticipantCount == maxParticipants)
            revert NoSeatsAvailable();
        _;
    }

    modifier onlyModerators() {
        if (msg.sender != owner() && !moderators[msg.sender])
            revert NotModerator();
        _;
    }

    function _register(address addr) private {
        participants[addr] = true;
        registeredParticipantCount += 1;
        emit ParticipantRegistered(addr);
    }

    function publicRegister(bytes32) external payable isRegistrationOpen {
        console.log("here");
        if (onlyWhitelistRegistration)
            revert AddressNotWhitelisted();
        if (msg.value < ticketPrice)
            revert ValueNotEnough();
        _register(msg.sender);
    }

    function whitelistRegister(bytes32[] calldata _proof) external payable isRegistrationOpen {
        if (!onlyWhitelistRegistration || !MerkleProof.verify(_proof, whitelistRoot, keccak256(abi.encodePacked(msg.sender))))
            revert AddressNotWhitelisted();
        if (msg.value < preSaleTicketPrice)
            revert ValueNotEnough();
        _register(msg.sender);
    }

    function checkIn(address participant) external onlyModerators {
        uint256 currTimestamp = block.timestamp;
        if (currTimestamp < start || currTimestamp > end)
            revert CheckInNotAvailable();
        if (!participants[participant])
            revert NotRegistered();
        if (checkedParticipants[participant])
            revert AlreadyCheckedIn();

        checkedParticipants[participant] = true;
        checkedParticipantCount += 1;
        emit ParticipantChecked(participant);
    }

    function addModerator(address addr, bool status) external onlyOwner {
        moderators[addr] = status;
    }

    function changeEventInfo(string memory _name, string memory _description, string memory _link, uint256 _maxParticipants) external onlyOwner {
        name = _name;
        description = _description;
        link = _link;
        maxParticipants = _maxParticipants;
    }

    function changeTicketPrices(uint256 _ticketPrice, uint256 _preSalePrice) external onlyOwner {
        ticketPrice = _ticketPrice;
        preSaleTicketPrice = _preSalePrice;
    }

    function changeEventDates(uint256 _start, uint256 _end, uint256 _registrationEnd) external onlyOwner {
        start = _start;
        end = _end;
        registrationEnd = _registrationEnd;
    }

    function changeWhitelistRoot(bytes32 rootHash) external onlyOwner {
        whitelistRoot = rootHash;
    }

    function toggleRegistration(bool _isOpen, bool _onlyWhitelist) external onlyOwner {
        registrationOpen = _isOpen;
        onlyWhitelistRegistration = _onlyWhitelist;
    }

  // whithdraw contract balance
  function withdraw() external onlyOwner {
      uint256 contractBalance = address(this).balance;
      if (contractBalance == 0)
        revert TransferFailed();

      bool success = true;
      uint256 ownerFee = 100 - parentContractFee;

      if (parentContractFee > 0) {
        (success, ) = payable(parentContractAddr).call{
            value: (parentContractFee * contractBalance) / 100
        }("");
        if (!success)
            revert TransferFailed();
      }

      (success, ) = payable(owner()).call{
          value: (ownerFee * contractBalance) / 100
      }("");

      if (!success)
        revert TransferFailed();
  }

}
