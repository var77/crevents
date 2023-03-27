// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Importing the necessary modules
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import 'erc721a-sbt/ERC721A-SBT.sol';

// Interface for the Event Creator
contract IEventCreator {
  string public tokenUriServer;
}

// Library for event-related data structures
library Utils {
  // Struct for creating an event
  struct EventStruct {
    uint32 maxParticipants; // maximum number of participants in the event
    uint256 registrationEnd; // timestamp until when registration is open
    uint256 start; // start time of the event
    uint256 end; // end time of the event
    uint256 ticketPrice; // price for tickets
    uint256 preSaleTicketPrice; // price for pre-sale tickets
    string name; // name of the event
    string link; // link to the event's website
    string image; // image of the event
    string location; // location of the event
    string description; // description of the event
    bool registrationOpen; // whether registration is open or not
    bool onlyWhitelistRegistration; // whether registration is limited to a whitelist or not
  }

  // Struct for updating an event
  struct EventUpdateStruct {
    uint32 maxParticipants; // maximum number of participants in the event
    uint256 registrationEnd; // timestamp until when registration is open
    uint256 start; // start time of the event
    uint256 end; // end time of the event
    uint256 ticketPrice; // price for tickets
    uint256 preSaleTicketPrice; // price for pre-sale tickets
    string description; // description of the event
    string link; // link to the event's website
    string location; // location of the event
    bool registrationOpen; // whether registration is open or not
    bool onlyWhitelistRegistration; // whether registration is limited to a whitelist or not
  }

  // Struct for getting event information
  struct EventInfoStruct {
    address addr; // address of the event contract
    address organizer; // address of the event organizer
    bool registrationOpen; // whether registration is open or not
    bool onlyWhitelistRegistration; // whether registration is limited to a whitelist or not
    bool isRegistered; // whether the user is registered for the event or not
    bool isChecked; // whether the user has checked in for the event or not
    uint32 maxParticipants; // maximum number of participants in the event
    uint256 registrationEnd; // timestamp until when registration is open
    uint256 start; // start time of the event
    uint256 end; // end time of the event
    uint256 ticketPrice; // price for tickets
    uint256 preSaleTicketPrice; // price for pre-sale tickets
    uint256 registeredParticipantCount; // number of participants registered for the event
    uint256 checkedParticipantCount; // number of participants checked in for the event
    string description; // description of the event
    string link; // link to the event's website
    string name; // name of the event
    string image; // image of the event
    string location; // location of the event
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
error BadRequest();
error CanNotModifyStartedEvent();

contract Event is Ownable, ERC721A_SBT {
  bool public onlyWhitelistRegistration;
  bool public registrationOpen = true;
  uint32 public maxParticipants;
  address public parentContractAddr;

  uint256 public registrationEnd;
  uint256 public start;
  uint256 public end;
  uint256 public registeredParticipantCount;
  uint256 public checkedParticipantCount;
  uint256 public ticketPrice;
  uint256 public preSaleTicketPrice;
  uint8 public parentContractFee;

  bytes32 public whitelistRoot =
    0x16d95910a21726a3e7b59a8c6166b355396434419809cb902e2063555b8d60de;

  string public description;
  string public link;
  string public image;
  string public location;

  mapping(address => bool) public participants;
  mapping(address => bool) public checkedParticipants;
  mapping(address => bool) public moderators;

  event ParticipantRegistered(address participant);
  event ParticipantChecked(address participant);

  /**
   * @dev Constructor function to initialize an instance of the contract with provided data.
   * @param eventData An object of the struct containing the event data.
   * @param owner The address that should be set as the owner of the contract.
   * @param fee The fee percentage that should be sent to the parent contract.
   * Requirements:
   * - `eventData.start` and `eventData.end` should be greater than zero.
   * - `eventData.registrationEnd` should be greater than or equal to zero.
   */
  constructor(
    Utils.EventStruct memory eventData,
    address owner,
    uint8 fee
  ) ERC721A_SBT(eventData.name, 'CREV') {
    // Check if required arguments are provided
    if (eventData.start == 0 || eventData.end == 0) {
      revert ProvideRequiredArguments();
    }

    // Set contract data from the provided `eventData` struct
    description = eventData.description;
    link = eventData.link;
    image = eventData.image;
    maxParticipants = eventData.maxParticipants;
    start = eventData.start;
    end = eventData.end;
    ticketPrice = eventData.ticketPrice;
    preSaleTicketPrice = eventData.preSaleTicketPrice;
    location = eventData.location;
    registrationOpen = eventData.registrationOpen;
    onlyWhitelistRegistration = eventData.onlyWhitelistRegistration;

    // Set `registrationEnd` based on provided or `start` value
    if (eventData.registrationEnd == 0) {
      registrationEnd = eventData.start;
    } else {
      registrationEnd = eventData.registrationEnd;
    }

    // Set parent contract address and fee
    parentContractAddr = msg.sender;
    parentContractFee = fee;

    // Transfer ownership to `owner`
    transferOwnership(owner);
  }

  /**
   * @dev Modifier to check if registration is currently open for the event
   * @return Throws an error if registration is not open or if the caller is already registered or if the event has already started or if no seats are available.
   */
  modifier isRegistrationOpen() {
    uint8 status = getRegistrationOpen(block.timestamp);
    if (status == 1) revert EventAlreadyStarted();
    if (status == 2) revert RegistrationClosed();
    if (status == 3) revert AlreadyRegistered();
    if (status == 4) revert NoSeatsAvailable();
    _;
  }

  /**
   * @dev Function to get the current registration status of the caller
   * @param currTimestamp The current timestamp to check registration status against
   * @return Returns an integer representing the registration status:
   * - 0: registration is open and caller is not registered
   * - 1: event has already started
   * - 2: registration is closed
   * - 3: caller is already registered
   * - 4: no more seats are available
   */
  function getRegistrationOpen(
    uint256 currTimestamp
  ) public view returns (uint8) {
    if (currTimestamp > start) return 1;
    if (!registrationOpen || currTimestamp > registrationEnd) return 2;
    if (participants[msg.sender]) return 3;
    if (maxParticipants > 0 && registeredParticipantCount == maxParticipants)
      return 4;

    return 0;
  }

  modifier onlyModerators() {
    if (msg.sender != owner() && !moderators[msg.sender]) revert NotModerator();
    _;
  }

  /**
   * @dev Registers the given address as a participant in the event by setting their `participants` mapping to true.
   * Also increments the `registeredParticipantCount` variable and mints a new NFT to the participant.
   * @param addr The address to register as a participant.
   * @private
   */
  function _register(address addr) private {
    participants[addr] = true;
    registeredParticipantCount += 1;
    _safeMint(addr, 1);
    emit ParticipantRegistered(addr);
  }

  /**
   * @dev Allows anyone to register for the event by sending the `ticketPrice` amount of ether to the contract.
   * Reverts if `onlyWhitelistRegistration` is set to true or if the value sent is less than `ticketPrice`.
   */
  function publicRegister() external payable isRegistrationOpen {
    if (onlyWhitelistRegistration) revert AddressNotWhitelisted();
    if (msg.value < ticketPrice) revert ValueNotEnough();
    _register(msg.sender);
  }

  /**
   * @dev Allows a whitelisted participant to register for the event by proving their address in the Merkle tree.
   * @param _proof An array of bytes32 values representing the proof needed to verify the participant's address in the Merkle tree.
   */
  function whitelistRegister(
    bytes32[] calldata _proof
  ) external payable isRegistrationOpen {
    // check if only whitelist registration is enabled and if the participant's address is whitelisted
    if (
      !onlyWhitelistRegistration ||
      !MerkleProof.verify(
        _proof,
        whitelistRoot,
        keccak256(abi.encodePacked(msg.sender))
      )
    ) revert AddressNotWhitelisted();
    // check if the participant has sent enough funds for the pre-sale ticket
    if (msg.value < preSaleTicketPrice) revert ValueNotEnough();
    // register the participant
    _register(msg.sender);
  }

  /**
   * @dev Allows moderators to check in a participant for the event.
   * @param participant The address of the participant to check in.
   */
  function checkIn(address participant) external onlyModerators {
    uint256 currTimestamp = block.timestamp;
    // Check if event has started and has not ended
    if (currTimestamp < start || currTimestamp > end)
      revert CheckInNotAvailable();
    // Check if participant is registered for the event
    if (!participants[participant]) revert NotRegistered();
    // Check if participant has already checked in
    if (checkedParticipants[participant]) revert AlreadyCheckedIn();

    // Set participant as checked in and increment checked participant count
    checkedParticipants[participant] = true;
    checkedParticipantCount += 1;

    // Emit event to indicate that participant has been checked in
    emit ParticipantChecked(participant);
  }

  function addModerator(address addr, bool status) external onlyOwner {
    moderators[addr] = status;
  }

  // Allows the owner to update the event information
  function changeEventInfo(
    Utils.EventUpdateStruct memory eventData
  ) external onlyOwner {
    // Check if the event has already started
    if (eventData.start < block.timestamp) revert CanNotModifyStartedEvent();
    // Check if the new maxParticipants value is less than the number of registered participants
    if (
      eventData.maxParticipants < registeredParticipantCount ||
      eventData.start > eventData.end
    ) revert BadRequest();

    // Update the event information
    description = eventData.description;
    link = eventData.link;
    location = eventData.location;
    maxParticipants = eventData.maxParticipants;
    ticketPrice = eventData.ticketPrice;
    preSaleTicketPrice = eventData.preSaleTicketPrice;
    start = eventData.start;
    end = eventData.end;
    registrationEnd = eventData.registrationEnd;
    registrationOpen = eventData.registrationOpen;
    onlyWhitelistRegistration = eventData.onlyWhitelistRegistration;
  }

  function changeWhitelistRoot(bytes32 rootHash) external onlyOwner {
    whitelistRoot = rootHash;
  }

  // This function returns information about the event
  // at the current timestamp, including event details
  // and information about the user's registration status.
  function getEventInfo(
    uint256 currTimestamp // current timestamp to check registration status
  ) external view returns (Utils.EventInfoStruct memory) {
    Utils.EventInfoStruct memory evt;
    evt.start = start; // event start timestamp
    evt.end = end; // event end timestamp
    evt.registrationEnd = registrationEnd; // registration end timestamp
    evt.name = name(); // event name
    evt.description = description; // event description
    evt.maxParticipants = maxParticipants; // maximum number of participants
    evt.ticketPrice = ticketPrice; // ticket price in main sale
    evt.preSaleTicketPrice = preSaleTicketPrice; // ticket price in pre-sale
    evt.link = link; // event link
    evt.image = image; // event image
    evt.location = location; // event location
    evt.organizer = owner(); // event organizer
    evt.registrationOpen = getRegistrationOpen(currTimestamp) == 0; // registration status
    evt.isRegistered = participants[msg.sender]; // user registration status
    evt.isChecked = checkedParticipants[msg.sender]; // user check-in status
    evt.registeredParticipantCount = registeredParticipantCount; // number of registered participants
    evt.checkedParticipantCount = checkedParticipantCount; // number of checked-in participants
    evt.addr = address(this); // event contract address

    return evt;
  }

  // verify participant ticket with signed message
  function verifyTicket(address owner) external view returns (bool) {
    return participants[owner];
  }

  // whithdraw contract balance
  function withdraw() external onlyOwner {
    uint256 contractBalance = address(this).balance;
    if (contractBalance == 0) revert TransferFailed();

    bool success = true;
    uint256 ownerFee = 100 - parentContractFee;

    if (parentContractFee > 0) {
      (success, ) = payable(parentContractAddr).call{
        value: (parentContractFee * contractBalance) / 100
      }('');
      if (!success) revert TransferFailed();
    }

    (success, ) = payable(owner()).call{
      value: (ownerFee * contractBalance) / 100
    }('');

    if (!success) revert TransferFailed();
  }

  function _startTokenId() internal view virtual override returns (uint256) {
    return 1;
  }

  /**
   * @dev Returns the URI for a given token ID. Throws an error if the token does not exist.
   * @param tokenId The ID of the token to query.
   * @return A string representing the token URI.
   */
  function tokenURI(
    uint256 tokenId
  ) public view virtual override returns (string memory) {
    // Check if token exists
    if (!_exists(tokenId)) {
      revert URIQueryForNonexistentToken();
    }

    // Get the base URI from the parent contract
    string memory tokenUri = IEventCreator(parentContractAddr).tokenUriServer();

    // Generate the complete token URI
    bytes memory encodedData = abi.encodePacked(
      tokenUri,
      Strings.toString(block.chainid),
      '/',
      Strings.toHexString(uint256(uint160(address(this))), 20),
      '/',
      Strings.toString(tokenId)
    );
    return string(encodedData);
  }
}
