const {expect} = require('chai')
const {ethers} = require('hardhat');

const tokens = (n) => {
    return ethers .parseUnits(n.toString(), 'ether')
}
  
describe('FlashLoan', () => {
    let deployer;
    let token, flashLoan, flashLoanReceiver;
    const tokensAmount = 1_000_000

    beforeEach(async () => {
        [deployer, customer] = await ethers.getSigners()

        const FlashLoan = await ethers.getContractFactory('FlashLoan');
        const FlashLoanReceiver = await ethers.getContractFactory('FlashLoanReceiver');
        const Token = await ethers.getContractFactory('Token');

        token = await Token.deploy('Never enough token', 'NVEN', tokensAmount.toString());
        flashLoan = await FlashLoan.deploy(token);

        await token.connect(deployer).approve(flashLoan.target, tokens(tokensAmount))
        //deposit otkens into the pool
        await flashLoan.connect(deployer).depositTokens(tokens(tokensAmount))
    
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.target);
    })

    describe('Deployment', () => {
        it('sends tokens to flash loan contract', async () => {
            expect(await token.balanceOf(flashLoan.target)).to.equal(tokens(tokensAmount));
        })
    })

    describe('Borrowing funds', () => {
        it('borrows funds from the pool', async () => {
            let amount = tokens(100);
            let transaction = flashLoanReceiver.connect(deployer).executeFlashLoan(amount);
            await transaction

            await expect(transaction).to.emit(flashLoanReceiver, 'LoanReceived')
                .withArgs(token.target, amount)
        })
    })
})