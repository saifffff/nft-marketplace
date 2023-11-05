// SPDX-License-Identifier: MIT

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4; // hardhat expects us to use this version

// import erc721 from openzeppelin   
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    // to inherit all the functions of erc721 standard we use is keyword
    uint public tokenCount;
    constructor()ERC721("cr7NFT", "CR7"){}
    // minting new nfts
    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return (tokenCount);
    }
}

