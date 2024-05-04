const {expect} = require('chai')
const {ethers} = require('hardhat');

describe('Counter', () => {
    let counter
    const initialCount = 1;
    const initialName = 'My counter'

    beforeEach(async () => {
        const Counter = await ethers.getContractFactory('Counter')
        counter = await Counter.deploy(initialName, initialCount)
    })

    describe('Deployment', () => {
        it('sets the initial count', async () => {
            expect(await counter.count()).to.equal(initialCount)
        });
    
        it('sets the initial name', async () => {
            expect(await counter.name()).to.equal(initialName)
        });
    })

    describe('Counting', () => {
        it('reads the count from public variable', async () => {
            expect(await counter.count()).to.equal(initialCount);
        })

        it('reads the count from getCount function', async () => {
            expect(await counter.getCount()).to.equal(initialCount);
        })

        it('increments the count', async () => {
            await counter.increment();
            expect(await counter.count()).to.equal(initialCount + 1);

            await counter.increment();
            expect(await counter.count()).to.equal(initialCount + 2);
        })

        it('decrements the count', async () => {
            await counter.decrement();
            expect(await counter.count()).to.equal(initialCount - 1);

            await expect(counter.decrement()).to.be.reverted;
        })

        it('reads the name from name variable', async () => {
            expect(await counter.name()).to.equal(initialName);
        })

        it('reads the name from getName function', async () => {
            expect(await counter.getName()).to.equal(initialName);
        })

        it('updates the name with setName function', async () => {
            let newName = 'New name';
            await counter.setName(newName);

            expect(await counter.getName()).to.equal(newName);
        })
        
    })
    
})