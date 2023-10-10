const nftwallet = require("../model/NFT");
const router =
 require("express").Router();

router.post("/:walletAddress/mintnft", async (req, res) => {
  const { title, description, token_id, image, nftMint } = req.body;
  const { walletAddress } = req.params;
  if (!walletAddress)
    return res.status(400).json({ message: "Wallet Address Not Found" });

  if (!title) return res.status(400).json({ message: "Title not found" });

  if (!description)
    return res.status(400).json({ message: "Description not found" });

  if (!token_id) return res.status(400).json({ message: "Token Id not found" });

  if (!image) return res.status(400).json({ message: "Image link not found" });

  if(!nftMint) return res.status(400).json({ message: "NFT Mint Address not found" });

  try {
    const nft = await nftwallet.findOne({ token_id });
    if (nft) {
      return res.status(400).send({ message: "Nft already exists" });
    }
    await nftwallet.create({
      title,
      description,
      walletAddress,
      token_id,
      image,
      nftMint,
    });
    const allNFT = await nftwallet.find({ nftMint });
    return res.json({
      message: `Successfully Minted NFT with ${title} & ${nftMint}`,
      nft: allNFT,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

router.get('/:walletAddress/dashboard', async(req, res) => {
  const { walletAddress } = req.params;
  if (!walletAddress)
  return res.status(400).json({ message: "Wallet Address Not Found" });

  try {
    const allNFT = await nftwallet.find({ walletAddress });
    return res.json({
      message: `Successfully Fetched NFT with ${walletAddress}`,
      nft: {allNFT},
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
})

// getAllNfts
router.get('/nfts', async(req, res) => {
  try {
    const response = await nftwallet.find({});
    console.log(response);
    
    const data = response.map(obj => ({
      [obj.nftMint]: obj.walletAddress
    }));
    
    console.log(data)
    return res.json({
      message: `Successfully Fetched All NFTs`,
      nft: data,
    })
  } catch(error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
})

module.exports = router;