const mongoose = require("mongoose");
const { Schema } = mongoose;

const NftSchema = new Schema({
  title: {
    type: String,
    required:true,
  },
  description: {
    type: String,
    required:true,
  },
  nftMint: {
    type: String,
    required:true,
  },
  token_id: {
    type: String,
    required:true
  },
  image:{
    type:String
  },
});

const nftwallet = mongoose.model("nftwallet", NftSchema);
module.exports = nftwallet;