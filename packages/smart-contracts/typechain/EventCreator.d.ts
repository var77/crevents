/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface EventCreatorInterface extends ethers.utils.Interface {
  functions: {
    "createEvent((string,string,string,uint256,uint256,uint256,uint256,uint256,uint256))": FunctionFragment;
    "events(uint256)": FunctionFragment;
    "fee()": FunctionFragment;
    "getEvents(uint256,uint256,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdraw()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "createEvent",
    values: [
      {
        name: string;
        description: string;
        link: string;
        maxParticipants: BigNumberish;
        registrationEnd: BigNumberish;
        start: BigNumberish;
        end: BigNumberish;
        ticketPrice: BigNumberish;
        preSaleTicketPrice: BigNumberish;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "events",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "fee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getEvents",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "createEvent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "events", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getEvents", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "EventCreated(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EventCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type EventCreatedEvent = TypedEvent<[string] & { addr: string }>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export class EventCreator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: EventCreatorInterface;

  functions: {
    createEvent(
      _eventData: {
        name: string;
        description: string;
        link: string;
        maxParticipants: BigNumberish;
        registrationEnd: BigNumberish;
        start: BigNumberish;
        end: BigNumberish;
        ticketPrice: BigNumberish;
        preSaleTicketPrice: BigNumberish;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    events(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    fee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getEvents(
      offset: BigNumberish,
      limit: BigNumberish,
      currTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          boolean,
          boolean,
          boolean,
          boolean,
          string
        ] & {
          name: string;
          description: string;
          link: string;
          maxParticipants: BigNumber;
          registrationEnd: BigNumber;
          start: BigNumber;
          end: BigNumber;
          ticketPrice: BigNumber;
          preSaleTicketPrice: BigNumber;
          registeredParticipantCount: BigNumber;
          checkedParticipantCount: BigNumber;
          registrationOpen: boolean;
          onlyWhitelistRegistration: boolean;
          isRegistered: boolean;
          isChecked: boolean;
          addr: string;
        })[]
      ]
    >;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  createEvent(
    _eventData: {
      name: string;
      description: string;
      link: string;
      maxParticipants: BigNumberish;
      registrationEnd: BigNumberish;
      start: BigNumberish;
      end: BigNumberish;
      ticketPrice: BigNumberish;
      preSaleTicketPrice: BigNumberish;
    },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  events(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  fee(overrides?: CallOverrides): Promise<BigNumber>;

  getEvents(
    offset: BigNumberish,
    limit: BigNumberish,
    currTimestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    ([
      string,
      string,
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      boolean,
      boolean,
      boolean,
      boolean,
      string
    ] & {
      name: string;
      description: string;
      link: string;
      maxParticipants: BigNumber;
      registrationEnd: BigNumber;
      start: BigNumber;
      end: BigNumber;
      ticketPrice: BigNumber;
      preSaleTicketPrice: BigNumber;
      registeredParticipantCount: BigNumber;
      checkedParticipantCount: BigNumber;
      registrationOpen: boolean;
      onlyWhitelistRegistration: boolean;
      isRegistered: boolean;
      isChecked: boolean;
      addr: string;
    })[]
  >;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createEvent(
      _eventData: {
        name: string;
        description: string;
        link: string;
        maxParticipants: BigNumberish;
        registrationEnd: BigNumberish;
        start: BigNumberish;
        end: BigNumberish;
        ticketPrice: BigNumberish;
        preSaleTicketPrice: BigNumberish;
      },
      overrides?: CallOverrides
    ): Promise<string>;

    events(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    getEvents(
      offset: BigNumberish,
      limit: BigNumberish,
      currTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      ([
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean,
        boolean,
        boolean,
        boolean,
        string
      ] & {
        name: string;
        description: string;
        link: string;
        maxParticipants: BigNumber;
        registrationEnd: BigNumber;
        start: BigNumber;
        end: BigNumber;
        ticketPrice: BigNumber;
        preSaleTicketPrice: BigNumber;
        registeredParticipantCount: BigNumber;
        checkedParticipantCount: BigNumber;
        registrationOpen: boolean;
        onlyWhitelistRegistration: boolean;
        isRegistered: boolean;
        isChecked: boolean;
        addr: string;
      })[]
    >;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "EventCreated(address)"(
      addr?: null
    ): TypedEventFilter<[string], { addr: string }>;

    EventCreated(addr?: null): TypedEventFilter<[string], { addr: string }>;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;
  };

  estimateGas: {
    createEvent(
      _eventData: {
        name: string;
        description: string;
        link: string;
        maxParticipants: BigNumberish;
        registrationEnd: BigNumberish;
        start: BigNumberish;
        end: BigNumberish;
        ticketPrice: BigNumberish;
        preSaleTicketPrice: BigNumberish;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    events(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    getEvents(
      offset: BigNumberish,
      limit: BigNumberish,
      currTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createEvent(
      _eventData: {
        name: string;
        description: string;
        link: string;
        maxParticipants: BigNumberish;
        registrationEnd: BigNumberish;
        start: BigNumberish;
        end: BigNumberish;
        ticketPrice: BigNumberish;
        preSaleTicketPrice: BigNumberish;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    events(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getEvents(
      offset: BigNumberish,
      limit: BigNumberish,
      currTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}