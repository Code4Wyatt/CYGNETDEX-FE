import React from "react";
import "./style.scss";
import cygnetdexlogo from "../../assets/images/logo.png";
import { TextField } from "@mui/material";
const CrossChainTool = () => {
  return (
    <div className="cross-chain-tool">
      <img src={cygnetdexlogo} style={{ height: "50px" }} className="logo" />
      <div className="subtitle">Cross Chain Swap</div>
      <div className="available">Available: 0.0BTC</div>

      <div style={{ display: "flex" }} className='input'>
        <label htmlFor="from-input" className='input-text'>From...</label>
        <input type="text" id="from-input" name="from-input" defaultValue="0.0" />
        <select name="dropdown">
          <option value="option1"></option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div style={{ display: "flex" }} className='input'>
        <label htmlFor="from-input" className='input-text'>To...</label>
        <input type="text" id="from-input" name="from-input" value="(ESTIMATED RECEIVED) 0.0" />
        <select name="dropdown">
          <option value="option1"></option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <TextField id="standard-basic" label="Receiving Address" variant="standard" />
    </div>
  );
};

export default CrossChainTool;
