const {expect} = require('chai')
const {ethers} = require('hardhat');

const tokens = (n) => {
    return ethers .parseUnits(n.toString(), 'ether')
  }
  
const ether = tokens
  

describe('RealEstate', () => {
    let realEstate, escrow;
    let seller, buyer, lender, inspector;
    let nftID = 1;
    let purchasePrice = ether(100);
    let escrowAmount = ether(20);

    beforeEach(async () => {
        [seller, buyer, lender, inspector] = await ethers.getSigners()

        const RealEstate = await ethers.getContractFactory('RealEstate');
        const Escrow = await ethers.getContractFactory('Escrow');

        realEstate = await RealEstate.deploy();
        escrow = await Escrow.deploy(
            realEstate.target,
            nftID,
            purchasePrice,
            escrowAmount,
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
        let balance;

      it('executes transation successfully', async () => {
        expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);

        await escrow.connect(buyer).depositEarnest({value: escrowAmount})
        balance = await escrow.getBalance()
        console.log("escrow balance:", ethers.formatEther(balance.toString()))

        await escrow.connect(inspector).updateInspectionStatus(true)
        await escrow.connect(buyer).approveSale()
        await escrow.connect(seller).approveSale()
        await escrow.connect(lender).approveSale()

        await escrow.connect(lender).depositLenderFunds({value: ether(80)})
        await escrow.connect(buyer).finalizeSale();

        console.log(ethers.provider.getBalance(seller.address));
        expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);
      });  
    })
})
