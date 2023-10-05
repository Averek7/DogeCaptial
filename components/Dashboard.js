import React, { useState, useEffect } from "react";
import Connect from "./Connect";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import axios from "axios";

function Dashboard() {
  const { publicKey } = useWallet();
  const [data, setData] = useState([]);

  const getAllNft = async () => {
    const response = await axios.get(
      `https://dogecapital.onrender.com/api/${publicKey}/dashboard`
    );
    setData(response.data.nft);
  };

  useEffect(() => {
    getAllNft();
  }, [publicKey]);

  console.log(data);
  return (
    <div>
      {publicKey ? (
        <div className="dashboard-container">
          <div className="card-collection">
            {data.map((item) => (
              <div key={item.id} className="card">
                <Image
                  src={item.image}
                  width={100}
                  height={100}
                  alt={item.title}
                />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <span>{item.token_id}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Connect />
      )}
    </div>
  );
}

export default Dashboard;
