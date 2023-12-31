import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//components
import Navigation from './navbar';
import { Spinner } from 'react-bootstrap';
import Home from './home';
import Create from './create';
import MyListedItems from './my-listed-items';
import MyPurchases from './my-purchases';

import { ethers } from "ethers"; // to connect metamask and metamask is connect to blockchain 
import mkpABI from '../contractsData/Marketplace.json'
import mkpAddress from '../contractsData/Marketplace-address.json'
import nftAddress from '../contractsData/NFT-address.json'
import nftABI from '../contractsData/NFT.json'


function App() {

   

  useEffect(() => {
    // Check if the user has Metamask active
    if (!window.ethereum) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }, [])
document.title = "NFT Shopper"
// loading hook to keep track of when our app is loading data from the blockchain (initially true we can set it to false when finished loading)
const [loading, setLoading] = useState(true)
// account useState Hook
const [account, setAccount] = useState(null)
// nft hook
const [nft, setNft] = useState({})
// marketplace hook 
const [marketPlace, setMarketPlace] = useState({})



// metaMask integration (login/connect)
const web3Handler = async () => {
  // get accounts from metamask
  // window.ethereum is an object that the metamask injects in the browser.
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  setAccount(accounts[0])
  // get provider from metamask ( abstraction for a connection to ethereum network)
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // get signer ( has access to private key use to sign msgs or txns)
  const signer = provider.getSigner()

  // listen for changes in the connected Ethereum network and reloads the current page when a network change occurs
  window.ethereum.on('chainChanged', (chainId) => {
    window.location.reload();
  })
  // listen if the connected account is changed
  window.ethereum.on('accountsChanged', async function (accounts) {
    setAccount(accounts[0])
    await web3Handler()
  })

  // load contracts from the blockchain
  loadContracts(signer)
}

const loadContracts = async (signer) => {
  // fetch deployed copies of the contract and set relative hooks
  const mkp = new ethers.Contract(mkpAddress.address, mkpABI.abi, signer)
  setMarketPlace(mkp)
  const nft = new ethers.Contract(nftAddress.address, nftABI.abi, signer)
  setNft(nft)
  setLoading(false) // finished loading data form the blockchain
}


return (
  // main div
  <BrowserRouter>
    <div className='App'>
      <>
        <Navigation web3Handler={web3Handler} account={account} />
      </>
      {
        loading ? ( // when loading data from blockchain
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spinner animation="border" style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
          </div>
        ) : ( // when finished loading
          <Routes>
            <Route path='/' element={
              <Home marketplace={marketPlace} nft={nft} />
            } />
            <Route path='/create' element={
              <Create marketplace={marketPlace} nft={nft} />
            } />
            <Route path='/my-listed-items' element={
              <MyListedItems marketplace={marketPlace} nft={nft} account={account} />
            } />
            <Route path='/my-purchases' element={
              <MyPurchases marketplace={marketPlace} nft={nft} account={account} />
            } />
          </Routes>
        )
      }
    </div>
  </BrowserRouter>
);
}

export default App;
