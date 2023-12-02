import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import ethlogo from './eth.png'

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(null)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    console.log("loadmarketplaceitems")
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        let myuri = uri.split("/")
        myuri = "" + myuri[myuri.length - 1]
        //console.log("myuri : ",myuri)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(`https://saif-nft.infura-ipfs.io/ipfs/${myuri}`)
        const metadata = await response.json()
        //console.log("metadata:",metadata);
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const checkAccountBalance = async (purchasePrice) => {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const myacc = accounts[0]
    const balance = await provider.getBalance(myacc);
    
    
    const formattedBalance = ethers.utils.formatEther(balance);
    const formattedPurchasePrice = ethers.utils.formatEther(purchasePrice);
    
  
    if (formattedBalance < purchasePrice) {
      alert(`Insufficient funds. Your MetaMask balance is ${formattedBalance} ETH, but the purchase requires ${formattedPurchasePrice} ETH.`);
      setBuying(null)
      return false; // Cancel purchase due to insufficient funds
    }
    return true; // Proceed with purchase
  };

  const buyMarketItem = async (item) => {
    setBuying(item)
    const hasBalance = await checkAccountBalance(item.totalPrice)
    console.log(hasBalance)
    
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
    setBuying(null)
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card className="h-100 bg-light" style={{ width: "15rem" }}>
                  <Card.Img variant="top" src={item.image} style={{ objectFit: "contain", height: "100%", width: "100%" }} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button
                        onClick={() => buyMarketItem(item)}
                        variant="dark"
                        size="lg"
                        disabled={buying && buying.itemId === item.itemId}
                      >
                        {buying === item ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <>
                            <img src={ethlogo} alt="ETH logo" style={{ width: "20px", marginRight: "5px" }} />
                            BUY {ethers.utils.formatEther(item.totalPrice)} ETH
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}



export default Home