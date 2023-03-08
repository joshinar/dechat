const { expect } = require('chai');

describe('Dechat', () => {
  it('Sets correct name', async () => {
    const Contract = await ethers.getContractFactory('Dechat');
    const dechat = await Contract.deploy('Dechat', 'DCT');
    expect(await dechat.name()).to.equal('Dechat');
  });
});
