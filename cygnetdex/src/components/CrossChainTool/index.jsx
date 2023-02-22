import React from "react";
import "./style.scss";
import cygnetdexlogo from "../../assets/images/logo.png";
const CrossChainTool = () => {
  return (
    <div className="cross-chain-tool">
      <img src={cygnetdexlogo} style={{ height: "50px" }} className="logo" />
      <div className="subtitle">Cross Chain Swap</div>
      <div className="available">Available: 0.0BTC</div>
      <div style={{ display: "flex" }}>
        <label for="from-input">From...</label>
        <input type="text" id="from-input" name="from-input" value="0.0" />
        <select name="dropdown">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div style={{ display: "flex" }}>
        <label for="from-input">To...</label>
        <input type="text" id="from-input" name="from-input" value="0.0" />
        <select name="dropdown">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
    </div>
  );
};

export default CrossChainTool;
