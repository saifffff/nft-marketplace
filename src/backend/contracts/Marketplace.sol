// SPDX-License-Identifier: MIT

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4; // hardhat expects us to use this version

// import erc721 from openzeppelin   

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";  //Contract module that helps prevent reentrant calls to a function.

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    // state variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sale 
    // immutabe means these variables can only be assigned value once
    constructor (uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }
}