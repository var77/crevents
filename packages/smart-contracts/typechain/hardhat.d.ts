/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Event",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Event__factory>;
    getContractFactory(
      name: "EventCreator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EventCreator__factory>;
    getContractFactory(
      name: "ERC721ASBTIERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721ASBTIERC721Receiver__factory>;
    getContractFactory(
      name: "ERC721ASBT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721ASBT__factory>;
    getContractFactory(
      name: "IERC721ASBT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721ASBT__factory>;

    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Event",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Event>;
    getContractAt(
      name: "EventCreator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.EventCreator>;
    getContractAt(
      name: "ERC721ASBTIERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721ASBTIERC721Receiver>;
    getContractAt(
      name: "ERC721ASBT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721ASBT>;
    getContractAt(
      name: "IERC721ASBT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721ASBT>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
