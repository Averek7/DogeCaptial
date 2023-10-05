import React, { useState } from "react";
import Loader from "./Loader";
import Error from "./Error";
import InputBox from "./InputBox";

function Forms() {
  const [data, setData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [localLoading, setLocalLoading] = useState(false);


  const handleChange = (e) => {
    setData({
        ...data,
        [e.target.name]: e.target.value,
      });
      console.log(data);
  }

  const addData = () => {

  }

  return (
    <div className="form-container">
      <div className="form-center">
        <div className="txt">
          <h1 style={{ margin: "10px 0px", color: "white"}}>NFT Details</h1>
        </div>
        <InputBox
          name="image"
          type="file"
          title="Select Image"
          value={data.imgInput}
          handleChange={handleChange}
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

        <div className="widthDiv">
          <button className="btn mintBtn" onClick={addData}>
            {localLoading ? <Loader height="25" width="25" /> : "Mint"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forms;
