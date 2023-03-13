import { useState } from "react";
import "./style.scss";
import cygnetdexlogo from "../../assets/images/logo.png";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";

interface initialState {
  currentUser: {
    user: [];
  };
}

interface AccountExchangeRequest {
  depositCoinCode: string;
  receiveCoinCode: string;
  depositCoinAmt: string;
  receiveCoinAmt: string;
  destinationAddr: string;
  refundAddr: string;
  equipmentNo: string;
  sourceType: string;
  sourceFlag: string;
}

const AccountExchangeComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [receivingAddress, setReceivingAddress] = useState<string>("");
  let currentUser = useSelector((state: initialState) => state.currentUser.user);
  let host = process.env.REACT_APP_HOST;
  let sourceFlag = process.env.REACT_APP_SOURCE_FLAG;

  console.log(currentUser);
  const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(event.target.value);
  };

  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value);
  };

  const handleReceivingAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceivingAddress(event.target.value);
  };

  const handleSubmit = async () => {
   console.log('submitted');
   try {
      
      const request = await fetch(`https://${host}/api/v2/accountExchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositCoinCode: "XRSWAN",
          receiveCoinCode: "XRP",
          depositCoinAmt: "0.000001",
        
          receiveCoinAmt: "1",
          destinationAddr: "rPAHeHC5pioxYBUkUtAmnEwe38QEpSF5Lv",
          refundAddr: "rPAHeHC5pioxYBUkUtAmnEwe38QEpSF5Lv",
          equipmentNo: "zfgryh918f93a19fdg6918a68cf5",
          sourceType: "H5",
          sourceFlag: sourceFlag,
        }),
      });
      const data = await request.json();
      console.log('DATAAAAAAAAAAAA', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cross-chain-tool">
      <img src={cygnetdexlogo} style={{ height: "50px" }} className="logo" />
      <div className="subtitle">Cross Chain Swap</div>
      <div className="available">Available: 0.0BTC</div>

      <div style={{ display: "flex" }} className="input">
        <label htmlFor="from-input" className="input-text">
          From...
        </label>
        <input
          type="text"
          id="from-input"
          name="from-input"
          defaultValue="0.0"
        />
        <select name="dropdown">
          <option value="option1"></option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <div style={{ display: "flex" }} className="input">
        <label htmlFor="from-input" className="input-text">
          To...
        </label>
        <input
          type="text"
          id="from-input"
          name="from-input"
          value="(ESTIMATED RECEIVED) 0.0"
        />
        <select name="dropdown">
          <option value="option1"></option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <TextField
        id="standard-basic"
        label="Receiving Address"
        variant="standard"
        className="receiving"
        value={receivingAddress}
        onChange={handleReceivingAddressChange}
      />
      <p>*NOTE: PLEASE USE NON-EXCHANGE ADDRESSES ONLY*</p>
      <button
        type="submit"
        className="swap-button"
        onClick={() => handleSubmit}
      >
        SWAP NOW
      </button>
    </div>
  );
};

export default AccountExchangeComponent;
