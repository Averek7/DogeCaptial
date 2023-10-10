import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../asset/solanaLogo.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function Header() {
  const router = useRouter();
  const urlpath = router.pathname;

  const navbarList = [
    {
      name: "MINT",
      link: "/",
    },
    {
      name: "PROFILE",
      link: "/dashboard",
    },
  ];
  return (
    <div className="header-container">
      <div className="navbarLogo">
        <Image src={logo} width="185" height="25" alt="logo" />
      </div>
      <div>
        <h1 className="navbarList">
          <div className="navbarList">
            {navbarList.map((listItem, index) => (
              <div
                key={index}
                className={
                  listItem.link ===
                  urlpath.substring(0, listItem.link.length + 1)
                    ? "activeNavbarItem"
                    : "navbarItem"
                }
              >
                <Link href={listItem.link} style={{ textDecoration: "none" }}>
                  <p>{listItem.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </h1>
      </div>
      <div>
        <WalletMultiButton />
      </div>
    </div>
  );
}

export default Header;
