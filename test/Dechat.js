const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const NAME = 'Dechat';
const SYMBOL = 'DCT';
const tokens = (n) => ethers.utils.parseUnits(n.toString(), 'ether');
describe('Dechat', () => {
  async function loadContractFactory() {
    const [deployer, otherAccount] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory(NAME);
    const dechat = await Contract.deploy(NAME, SYMBOL);
    return { dechat, deployer, otherAccount };
  }
  describe('Deployment', () => {
    it('Sets correct name', async () => {
      const { dechat } = await loadFixture(loadContractFactory);
      expect(await dechat.name()).to.equal(NAME);
    });
    it('Sets correct symbol', async () => {
      const { dechat } = await loadFixture(loadContractFactory);
      expect(await dechat.symbol()).to.equal(SYMBOL);
    });
    it('Sets correct owner', async () => {
      const { dechat, deployer } = await loadFixture(loadContractFactory);
      expect(await dechat.owner()).to.equal(deployer.address);
    });
  });

  describe('Creating Channels', () => {
    it('Returns total channels and attributes', async () => {
      const { dechat, deployer } = await loadFixture(loadContractFactory);
      await dechat.connect(deployer).createChannel('general', tokens(1));
      expect(await dechat.totalChannels()).to.equal(1);
      const channel = await dechat.channels(1);
      expect(channel.id).to.equal(1);
      expect(channel.name).to.equal('general');
      expect(channel.cost).to.equal(tokens(1));
    });
  });

  describe('withdrawing', () => {
    it('withdraw to owner a/c', async () => {
      const { dechat, deployer, otherAccount } = await loadFixture(
        loadContractFactory
      );
      await dechat.connect(deployer).createChannel('general', tokens(1));
      await dechat.connect(otherAccount).mint(1, { value: tokens(1) });
      const balanceBefore = await ethers.provider.getBalance(deployer.address);
      await dechat.connect(deployer).withdraw();
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceBefore).to.be.greaterThan(balanceAfter);
      expect(await ethers.provider.getBalance(dechat.address)).to.equal(0);
    });
  });
});
