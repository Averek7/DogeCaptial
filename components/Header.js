import React from "react";
import Image from "next/image";
import logo from "../asset/solanaLogo.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function Header() {
  return (
    <div className="header-container">
      <div className="navbarLogo">
        <Image src={logo} width="200" height="30" alt="logo" />
      </div>
      <div>
        <h1 className="title">Solana NFT Upload</h1>
      </div>
      <div>
        <WalletMultiButton />
      </div>
    </div>
  );
}

export default Header;
