import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
// import { io } from 'socket.io-client';
// Components
import Navigation from './components/Navigation';
import Servers from './components/Servers';
import Channels from './components/Channels';
import Messages from './components/Messages';
// ABIs
import Dechat from './abis/Dechat.json';
// Config
import config from './config.json';
// Socket
// const socket = io('ws://localhost:3030');

const App = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [channels, setChannels] = useState([]);
  const laodBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    const signer = provider.getSigner();
    const address = await await signer.getAddress();
    const contract = new ethers.Contract(
      config[network.chainId].address,
      Dechat,
      provider
    );
    setContract(contract);
    const totalChannels = await contract.totalChannels();
    console.log(totalChannels);
    for (let i = 1; i <= totalChannels; i++) {
      const channel = await contract.channels(i);
      setChannels([...channels, channel]);
    }
    window.ethereum.on('accountsChanged', async () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    laodBlockchainData();
  }, []);
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <main>
        <Servers />
        <Channels />
        <Messages />
      </main>
    </div>
  );
};

export default App;
