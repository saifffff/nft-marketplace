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

    // event offered
    event Offered(
        uint itemId,
        address indexed nft, 
        uint tokenId,
        uint price,  
        address indexed seller
    );

    // event bought
    event Bought(
        uint itemId,
        address indexed nft, 
        uint tokenId,
        uint price,  
        address indexed seller,
        address indexed buyer
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
        
        // emit the offered event on adding an item
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );

    }

    // function that allows users to purchase nft
    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        // verify if the item id is valid
        require(_itemId > 0 && _itemId <= itemCount,"Item doesn't exist");
        // to make sure we have enough ether for the transaction
        require(msg.value >= _totalPrice, "Not enough ether to cover the sale price");
        // to make sure the nft hasn't already been sold
        require(!item.sold,"Item already sold");
        // pay seller 
        item.seller.transfer(item.price);
        // pay fee 
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // finally transfer nft to the buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        // emit bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );

    }

    // compute final price of an item
    function getTotalPrice (uint _itemId) view public returns(uint){
        return(items[_itemId].price*(100 + feePercent) / 100);
    }
}