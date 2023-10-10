import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import InputBox from "./InputBox";
import { create } from "ipfs-http-client";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import axios from "axios";
import { Web3Storage } from "web3.storage";
import Connect from "./Connect";
import { toast } from "react-toastify";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
  toMetaplexFile,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";

function Forms() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useWallet();

  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(
      bundlrStorage(
        {
          address: "https://devnet.bundlr.network",
          providerUrl: "https://api.devnet.solana.com",
          timeout: 60000,
        },
        [connection, wallet]
      )
    );

  const [data, setData] = useState({
    title: "",
    description: "",
    image: "",
    token_id: "",
  });
  const projectId = "2Hudfo5sCvhNRgff6cSVH6o7OCJ";
  const projectSecret = "ebebdc46b40438ee646c43cba5dbca9e";
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhQTQzM0RkY2M4QzM5YWJFQzdmNzZDM2REQjlFOTBhMWY3RTk2RjMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjkxMjcxMDk3NjMsIm5hbWUiOiJsZW5kTmZ0In0.7Zu-wSF34-7GlU5rVIXAvrIczw6MQYT4yV7vOVU9pis`;
  const storage = new Web3Storage({ token: token });

  const [localLoading, setLocalLoading] = useState(false);

  const handleSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    console.log(data);
  };

  const customHeaders = {
    "Content-Type": "application/json",
  };

  const mintData = async () => {
    try {
      setLocalLoading(true);
      const { uri } = await metaplex.nfts()?.uploadMetadata({
        name: data.title,
        description: data.description,
        image: data.image,
      });
      console.log(uri);

      let mintAddress;
      const { mintNft } = await metaplex
        .nfts()
        ?.create({
          uri: uri,
          name: data.title,
          sellerFeeBasicPoints: 500,
        })
        .then((res) => {
          mintAddress = res.mintAddress.toString();
          console.log(mintAddress);
          axios
            .post(
              `https://dogecapital.onrender.com/api/${publicKey}/mintnft`,
              {
                title: data.title,
                description: data.description,
                image: data.image,
                token_id: data.token_id,
                nftMint: mintAddress,
              },
              {
                headers: customHeaders,
              }
            )
            .then((res) => {
              console.log(res);
              setData({
                image: "",
                title: "",
                description: "",
                token_id: "",
              });
              handleSuccess("Minted !");
              setLocalLoading(false);
            })
            .catch((err) => {
              console.log(err);
              handleError("Error Occured !");
              setLocalLoading(false);
            });
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const addData = async () => {
    setLocalLoading(true);
    console.log("clicked");
    const auth =
      "Basic " +
      Buffer.from(projectId + ":" + projectSecret).toString("base64");

    const client = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers: {
        authorization: auth,
      },
    });
    setLocalLoading(true);
    client
      .add(JSON.stringify(data))
      .then(async (response) => {
        console.log("result", `https://ipfs.io/ipfs/${response.path}`);
        const dataIpfs = `https://ipfs.io/ipfs/${response.path}`;
        console.log("addresss", publicKey);
        console.log("dataIPFS", dataIpfs);

        try {
          const res = await axios.post(
            `https://dogecapital.onrender.com/api/${publicKey}/mintnft`,
            data,
            {
              headers: customHeaders,
            }
          );
          console.log(res);
          setData({
            image: "",
            title: "",
            description: "",
            token_id: "",
          });
          handleSuccess("Minted !");
          setLocalLoading(false);
        } catch (error) {
          handleError("Error Occured !");
          setLocalLoading(false);
        }
        setLocalLoading(false);
      })
      .catch((error) => {
        setLocalLoading(false);
        handleError(error.message);
      });
  };

  const nftUpload = (e) => {
    e.preventDefault();
    setLocalLoading(true);
    const nFile = e.target.files;
    console.log(nFile);
    storage
      .put(nFile)
      .then((res) => {
        console.log(res);
        setLocalLoading(false);
        setData({
          ...data,
          image: `https://ipfs.io/ipfs/${res}/${nFile[0].name}`,
        });
        handleSuccess("Image Uploaded");
      })
      .catch((err) => {
        setLocalLoading(false);
        handleError(err.message);
      });
    console.log(data.image);
  };

  return (
    <>
      {publicKey ? (
        <div className="form-container">
          <div className="form-center">
            <div className="txt">
              <h1 style={{ margin: "10px 0px", color: "white" }}>
                NFT Details
              </h1>
            </div>
            <InputBox
              name="image"
              type="file"
              title="Select Image"
              value={data.imgInput}
              // handleChange={handleChange}
              handleChange={nftUpload}
              placeholder="Item Name"
              disabled={localLoading}
            />
            <InputBox
              name="title"
              title="Title"
              value={data.title}
              handleChange={handleChange}
              placeholder="Item Name"
              disabled={localLoading}
            />

            <label className="inputLabel">
              Description:
              <textarea
                className="inputBox"
                name="description"
                value={data.description}
                onChange={handleChange}
                placeholder="Provide detailed description of your item"
                disabled={localLoading}
              />
            </label>

            <InputBox
              name="token_id"
              title="Token ID"
              value={data.token_id}
              handleChange={handleChange}
              placeholder="Item Name"
              disabled={localLoading}
            />

            <div className="widthDiv">
              <button className="btn mintBtn" onClick={mintData}>
                {localLoading ? <Loader height="25" width="25" /> : "Mint"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Connect />
      )}
    </>
  );
}

export default Forms;
