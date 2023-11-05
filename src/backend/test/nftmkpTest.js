

const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("NFT-Marketplace", async function(){
    let deployer, addr1, addr2, nft, mkp
    let URI = "sample uri";
    beforeEach(async function(){ // is a hook that get exec before each test in the suite
        // to write  test against contracts we require their ABI
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2] = await ethers.getSigners();
    
        // deploying contracts
        nft = await NFT.deploy();
        mkp = await Marketplace.deploy(1);
    });
    describe("Deployment test", function(){
        it("Should track name and symbol of the nft collection", async function(){
            expect(await nft.name()).to.equal("cr7NFT")
            expect(await nft.symbol()).to.equal("CR7")
        })
        it("Should track feeAccount and feePercentage of the marketplace contract", async function(){
            expect(await mkp.feePercent()).to.equal(1);
            expect(await mkp.feeAccount()).to.equal(deployer.address);
        })
    })
    describe("minting NFTs", function(){
        it("Should track each minted NFT", async function(){
            // address 1 shuld mint a nft 
            await nft.connect(addr1).mint(URI)
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            // address 2 mints a nft after address 1
            await nft.connect(addr2).mint(URI)
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })
})