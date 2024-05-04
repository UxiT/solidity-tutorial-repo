const {expect} = require('chai')
const {ethers} = require('hardhat');

describe('RealEstate', () => {
    let realEstate, escrow;
    let seller, buyer, lender, inspector;
    let nftID = 1;

    beforeEach(async () => {
        [seller, buyer, lender, inspector] = await ethers.getSigners()

        const RealEstate = await ethers.getContractFactory('RealEstate');
        const Escrow = await ethers.getContractFactory('Escrow');

        realEstate = await RealEstate.deploy();
        escrow = await Escrow.deploy(
            realEstate.target,
            nftID,
            ethers.parseUnits('100', 'ether'),
            ethers.parseUnits('20', 'ether'),
            seller.address,
            buyer.address,
            lender.address,
            inspector.address
        );

        await realEstate.connect(seller).approve(escrow.target, nftID)
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

        expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);
      });  
    })
})
