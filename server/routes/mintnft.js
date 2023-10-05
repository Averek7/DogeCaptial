const nftwallet = require("../model/NFT");
const router = require("express").Router();

router.post(
  "/:contract_address/:wallet_address/importnft",
  async (req, res) => {
    try {
      const { token_id, title, description, image } = req.body;
      const { contract_address, wallet_address } = req.params;

      if (!title) return res.json({ message: "Title is required" });
      if (!description) return res.json({ message: "Description is required" });
      if (!image) return res.json({ message: "Image Link is required" });

      if (!wallet_address)
        return res.json({ message: "Wallet address Not found" });
      if (!contract_address)
        return res.json({ message: "Contract address Not found" });

      var contractABI;
      // Fetch ABI

      const nft = await nftwallet.findOne({
        $and: [{ contract_address }, { token_id }],
      });
      if (nft) {
        return res.status(400).send({ message: "Nft already exists" });
      }

      await nftwallet
        .create({
          title,
          description,
          image,
          wallet_address,
          contract_address,
          token_id,
          status: "open",
        })
        .then(async () => {
          const allNFT = await nftwallet.find({ wallet_address });
          return res.status(200).json({
            message: `Successfully Imported NFT with ${title} & ${contract_address}`,
            nfts: allNFT,
          });
        });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  }
);

router.post("/:wallet_address/mintnft", async (req, res) => {
  const { title, description, token_id, image } = req.body;
  const { wallet_address } = req.params;
  if (!wallet_address)
    return res.status(400).json({ message: "Wallet Address Not Found" });

  if (!title) return res.status(400).json({ message: "Title not found" });

  if (!description)
    return res.status(400).json({ message: "Description not found" });

  if (!token_id) return res.status(400).json({ message: "Token Id not found" });

  if (!image) return res.status(400).json({ message: "Image link not found" });

  try {
    const nft = await nftwallet.findOne({
      $and: [{ token_id }],
    });
    if (nft) {
      return res.status(400).send({ message: "Nft already exists" });
    }
    await nftwallet.create({
      title,
      description,
      wallet_address,
      token_id,
      image,
    });
    const allNFT = await nftwallet.find({ wallet_address });
    return res.json({
      message: `Successfully Minted NFT with ${title} & ${wallet_address}`,
      nft: allNFT,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;