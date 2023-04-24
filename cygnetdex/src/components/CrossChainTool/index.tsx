import "./style.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import cygnetdexlogo from "../../assets/images/logo.png";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { initialState, AccountExchangeRequest, DataResponse } from '../../types/types';
import queryCoinList from '../../api/queryCoinList';

const AccountExchangeComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [receivingAddress, setReceivingAddress] = useState<string>("");
  const [coins, setCoins] = useState<any[]>([]);

  let currentUser = useSelector(
    (state: initialState) => state.currentUser
  );

  let host = process.env.REACT_APP_HOST;
  let sourceFlag = process.env.REACT_APP_SOURCE_FLAG;

  console.log("currentUser", currentUser);

   useEffect(() => {
    const getCoinList = async () => {
      let coinList = await queryCoinList();
      setCoins(coinList);
    };
    getCoinList();
    
  }, []);

  const getHeldCoins = (coins: any): any | undefined => {
    if (coins) {
      let heldCoins = [];
      for (let i = 0; i < coins?.data?.length; i++) {
        console.log('hoisadasda', coins.data[i].isSupportMemo);
        if (coins.data[i].isSupportMemo == "Y") {
          heldCoins.push(coins.data[i]);
        }
      }
      console.log(heldCoins);
      return heldCoins;
    }
  }

  getHeldCoins(coins);


  const handleFromChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
