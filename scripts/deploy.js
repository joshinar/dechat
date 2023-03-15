const hre = require('hardhat');
const tokens = (n) => hre.ethers.utils.parseUnits(n.toString(), 'ether');
async function main() {
  const NAME = 'Dechat';
  const SYMBOL = 'DCT';
  const [deployer] = await hre.ethers.getSigners();
  const Contract = await hre.ethers.getContractFactory(NAME);
  const dechat = await Contract.deploy(NAME, SYMBOL);
  await dechat.deployed();

  console.log(`Contract successfully deployed @ ${dechat.address}`);
  // create 3 channels
  const names = ['general', 'intro', 'jobs'];
  const costs = [1, 0, 0.25];
  for (let i = 0; i < 3; i++) {
    const transaction = await dechat
      .connect(deployer)
      .createChannel(names[i], tokens(costs[i]));
    await transaction.wait();
    console.log(`Channel created ---> ${names[i]}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
