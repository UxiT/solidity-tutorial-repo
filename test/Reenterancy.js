const {expect} = require('chai')
const {ethers} = require('hardhat');

const tokens = (n) => {
    return ethers .parseUnits(n.toString(), 'ether')
  }
  
const ether = tokens

describe('Reentrancy', () => {
    let deployer, user, attacker;
    let bank, attackerContract;
    
    beforeEach(async () => {
        [deployer, user, attacker] = await ethers.getSigners();
        
        const Bank = await ethers.getContractFactory('Bank', deployer);
        bank = await Bank.deploy();

        await bank.connect(deployer).deposit({ value: ether(100) })
        await bank.connect(user).deposit({ value: ether(60) })

        const Attacker = await ethers.getContractFactory('Attacker', attacker);
        attackerContract = await Attacker.deploy(bank.target, attacker.address);
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

        it('allows attacker to drain funds', async () => {
            let bankBalance = await ethers.provider.getBalance(bank.target);
            let attackerBalance = await ethers.provider.getBalance(attacker.address);
            console.log("=== Before ===")
            console.log("Bank balance: ", ethers.formatEther(bankBalance));
            console.log("Attacker balance: ", ethers.formatEther(attackerBalance));

            await attackerContract.attack({value: ether(10)})

            bankBalance = await ethers.provider.getBalance(bank.target);
            attackerBalance = await ethers.provider.getBalance(attacker.address);

            console.log("=== After ===")
            console.log("Bank balance: ", ethers.formatEther(bankBalance));
            console.log("Attacker balance: ", ethers.formatEther(attackerBalance));

            expect(await ethers.provider.getBalance(bank.target)).to.eq(0)
        })
    })
})