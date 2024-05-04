const {expect} = require('chai')
const {ethers} = require('hardhat');

describe('RealEstate', () => {
    let realEstate, escrow;
    let deployer, seller, buyer;
    let nftID = 1;

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]

        const RealEstate = await ethers.getContractFactory('RealEstate');
        const Escrow = await ethers.getContractFactory('Escrow');

        realEstate = await RealEstate.deploy();
        escrow = await Escrow.deploy(
            realEstate.address,
            nftID,
            realEstate.address,
            realEstate.address
        );

        // await realEstate.connect(seller).approve(escrow.address, nftID)
    })

    describe('Deployment', () => {
        it('sends and NFT to seller / deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })

    describe('Selling real estate', () => {
      it('executes transation successfully', async () => {
        expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);

        transaction = await escrow.connect(buyer).finalizeSale();
        console.log("Buyer finalizes sale")

        expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);
      });  
    })
})
