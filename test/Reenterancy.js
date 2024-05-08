const {expect} = require('chai')
const {ethers} = require('hardhat');

const tokens = (n) => {
    return ethers .parseUnits(n.toString(), 'ether')
  }
  
const ether = tokens

describe('Reentrancy', () => {
    let deployer;
    let bank;
    
    beforeEach(async () => {
        [deployer, user] = await ethers.getSigners();
        
        const Bank = await ethers.getContractFactory('Bank', deployer);
        bank = await Bank.deploy();

        await bank.connect(deployer).deposit({ value: ether(100) })
        await bank.connect(user).deposit({ value: ether(60) })
    })

    describe('facilitates deposit and withdraws', () => {
        it('accepts deposits', async () => {
            const deployerBalance = await bank.balanceOf(deployer.address);
            const userBalance = await bank.balanceOf(user.address);

            expect(deployerBalance).to.eq(ether(100))
            expect(userBalance).to.eq(ether(60))
        })

        it('accept withdraws', async () => {
            await bank.connect(deployer).withdraw()
            const deployerBalance = await bank.balanceOf(deployer.address);
            const userBalance = await bank.balanceOf(user.address);

            expect(deployerBalance).to.eq(ether(0))
            expect(userBalance).to.eq(ether(60))
        })
    })
})