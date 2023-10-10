import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Forms from "./Forms";

function UseConnect() {
  const {publicKey, wallet} = useWallet();
  const [walletAvailable, setWalletAvailable] = useState(false);
  const [provider, setProvider] = useState(null);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    if ("solana" in window) {
      if (window.solana) { 
        console.log("solana")
        setWalletAvailable(true);
        setProvider(window.solana);
        window.solana.connect({ onlyIfTrusted: true });
      }
    }
  }, [publicKey]);
  console.log(walletAvailable);

  useEffect(() => {
    provider?.on("connect", (publicKey) => {
      setConnection(true);
    });
    provider?.on("disconnect", () => {
      setConnection(false);
    });
  }, [provider]);

  const connectHandler = (event) => {
    console.log(`Connecting...`);
    provider?.connect().catch((err) => {
      console.error(err.message);
    });
  };

  const disconnectHandler = (event) => {
    console.log(`Disconnecting...`);
    provider?.disconnect().catch((err) => {
      console.error(err.message);
    });
  };
  return (
    <div className="">
      {walletAvailable ? (
        <>
          {!connection ? (
            <button className="" disabled={connection} onClick={connectHandler}>Connect to Solana</button>
          ) : (
            <>
              <div className="" disabled={!connection} onClick={disconnectHandler}>
                <button className="">Disconnect from Solana</button>
                <br />
                <Forms provider={provider} />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p>
            Phantom Wallet Not Found ! Refer to {""}{" "}
            <a href="https://phantom.app/">https://phantom.app/</a>
          </p>
        </>
      )}
    </div>
  );
}

export default UseConnect;
