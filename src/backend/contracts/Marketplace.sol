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
    uint public itemCount;

    struct Item {
        uint itemId; // each item will be assigned an item id
        IERC721 nft; // an instance of the nft contract associated with nft
        uint tokenId; // the id of the nft being put for sale
        uint price; // sale price   
        address payable seller; // seller's address
        bool sold; // has been sold or not
    }

    // to store all the items we use mapping key = item id, value = item struct(object)
    mapping(uint => Item) public items;

    // event
    event Offered(
        uint itemId,
        address indexed nft, 
        uint tokenId,
        uint price,  
        address indexed seller
    );


    

    constructor (uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // function that creates items (making it nonReentrant makes sure that bad guys do not get to call make item function before the first call is finished)
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        // verify that the input price is not zero
        require(_price > 0, "price must be greater than zero");
        //increment itemCount
        itemCount++;
        // transfer nft from the owner to market place
        _nft.transferFrom(msg.sender,address(this),_tokenId);
        // add new item ot items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        
        // emit the offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );

    }
}