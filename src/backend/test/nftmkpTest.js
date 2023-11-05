

const {expect} = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString())  // 1 eth == 10^18 wei
const fromWei = (num) => ethers.utils.formatEther(num)

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

    describe("making marketplace items", function(){
        let price = 1
        let result
        beforeEach(async function(){
            // addr1 mints ans nft
            await nft.connect(addr1).mint(URI)
            // addr1 approves marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(mkp.address,true)

        })


        it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function(){
            // address1 offers his nft at a price of 1 ether
            await expect(mkp.connect(addr1).makeItem(nft.address,1,toWei(price)))
            .to.emit(mkp,"Offered")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address
            )
            // now marketplace should be the new owner of the nft
            expect(await nft.ownerOf(1)).to.equal(mkp.address);
            // now the item count of the marketplace should have been incremented by 1
            expect(await mkp.itemCount()).to.equal(1);
            // getting the item form items mapping and checking all fields are correct
            const item = await mkp.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(toWei(price))
            expect(item.sold).to.equal(false)
        });


        // failure test case 
        it("Should fail if price is set to zero", async function(){
            await expect(
                mkp.connect(addr1).makeItem(nft.address,1,0)
            ).to.be.revertedWith("price must be greater than zero");
        })
        
    })

})