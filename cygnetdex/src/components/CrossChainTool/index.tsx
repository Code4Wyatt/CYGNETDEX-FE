import { useState, useEffect } from "react";
import "./style.scss";
import cygnetdexlogo from "../../assets/images/logo.png";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";

interface initialState {
  currentUser: {
    user: []
  }

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
  length: number;
}

const AccountExchangeComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [receivingAddress, setReceivingAddress] = useState<string>("");
  const [coins, setCoins] = useState<string[]>([]);

  let currentUser = useSelector(
    (state: initialState) => state.currentUser
  );
  let host = process.env.REACT_APP_HOST;
  let sourceFlag = process.env.REACT_APP_SOURCE_FLAG;

  console.log("OWERRRR", currentUser);


  useEffect(() => {
    const fetchAccountBalances = async () => {
      try {
        let params = {
          "coinAllCode": "xrswan",
          "coinCode": "XRSWAN",
          "coinName": "XRSWAN",
          "isSupportAdvance": "N",
        }
        const response = await axios.post(
          `${host}/api/v1/queryCoinList`,
          params
        );
        let data = await response.data;
        console.log('fetchAccountBalances data', data)
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    fetchAccountBalances();
  }, [host]);

  const handleFromChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFrom(event.target.value);
    // try {
    //   let params = {
    //     depositCoinCode: "ETH",
    //     receiveCoinCode: "BNB(BSC)",
    //   };
    //   let rateData = await axios.post(
    //     `https://${host}/api/v1/getBaseInfo`,
    //     params
    //   );
    //   // console.log(rateData);
    // } catch (error) {
    //   console.log("handleFromChange ERROR", error);
    // }
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
    console.log("submitted");
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
      console.log("DATAAAAAAAAAAAA", data);
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
          onChange={handleFromChange}
        />
        <select name="dropdown">
          <option value="option1"></option>
          <option value="option2">XRSwan</option>
          <option value="option3">CygnetX</option>
          <option value="option3">XRP</option>
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
          <option value="option2">XRSwan</option>
          <option value="option3">CygnetX</option>
          <option value="option3">XRP</option>
          <option value="option2">XRSwan</option>
          <option value="option3">CygnetX</option>
          <option value="option3">XRP</option>
          <option value="option2">XRSwan</option>
          <option value="option3">CygnetX</option>
          <option value="option3">XRP</option>
          <option value="option2">XRSwan</option>
          <option value="option3">CygnetX</option>
          <option value="option3">XRP</option>
          <option value="option2">XRSwan</option>
          <option value="option3">CygnetX</option>
          <option value="option3">XRP</option>
          <option value="option2">XRSwan</option>
          <option value="option3">CygnetX</option>
          <option value="option3">XRP</option>
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
