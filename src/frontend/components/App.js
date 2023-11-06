import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//components
import Navigation from './navbar';

import { ethers } from "ethers"; // to connect metamask and metamask is connect to blockchain (local hardhat node rnw);
import mkpABI from '../contractsData/Marketplace.json'
import mkpAddress from '../contractsData/Marketplace-address.json'
import nftAddress from '../contractsData/NFT-address.json'
import nftABI from '../contractsData/NFT.json'


function App() {
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
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
    // get provider from metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum); // window.ethereum is an object that the metamask injects in the browser.
    // get signer 
    const signer = provider.getSigner()

    // load contracts from the blockchain
    loadContracts(signer)
  }

  const loadContracts = async (signer) => {
    // fetch deployed copies of the contract 
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
        <h1> Welcome to your favorite NFT Store </h1>
      </div>
    </BrowserRouter>
  );
}

export default App;
