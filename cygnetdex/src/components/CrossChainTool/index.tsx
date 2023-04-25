import "./style.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import cygnetdexlogo from "../../assets/images/logo.png";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { initialState, AccountExchangeRequest, DataResponse } from '../../types/types';
import queryCoinList from '../../api/queryCoinList';
import getBaseInfo from "../../api/getBaseInfo";
import CoinLogo from '../CoinLogo';

interface Coin {
  coinAllCode: String,
  coinCode: String,
  coinDecimal: 8,
  contact: String,
  isSupportAdvanced: String,
  isSupportMemo: String,
  mainNetwork: String,
  noSupportCoin: String
}

const AccountExchangeComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [toOptions, setToOptions] = useState<string[]>([]);
  const [to, setTo] = useState<string>("");
  const [receivingAddress, setReceivingAddress] = useState<string>("");
  const [coins, setCoins] = useState<any[]>([]);
  const [showLogoGrid, setShowLogoGrid] = useState(false);

  let currentUser = useSelector(
    (state: initialState) => state.currentUser
  );

  let host = process.env.REACT_APP_HOST;
  let sourceFlag = process.env.REACT_APP_SOURCE_FLAG;

  console.log("currentUser", currentUser);

  useEffect(() => {

  }, []);

  const toggleLogoGrid = () => {
    setShowLogoGrid(!showLogoGrid);
  };

  const handleFromSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let coinList = await queryCoinList();
    let coinListValues = coinList.data.map((coin: Coin) => coin.coinAllCode);

    setFrom(value);
    setToOptions(coinListValues);

    console.log('from', value);

  };

  console.log(from)
  console.log('coinList', toOptions);

  const handleToSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTo(value);
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
          name="from-input-value"
          defaultValue={from}
        />
        <select name="dropdown" value={from} onChange={handleFromSelectChange} className='from-select'>
          <option value="option1"></option>
          <option value="XRSwan">XRSwan</option>
          <option value="CygnetX">CygnetX</option>
          <option value="XRP">XRP</option>
        </select>
      </div>
      <div style={{ display: "flex" }} className="input">
        <label htmlFor="to-input" className="input-text">
          To...
        </label>
        <input
          type="text"
          id="to-input"
          name="to-input-value"
          defaultValue={to}
        />
        <p style={{ position: 'relative', right: '50px', width: '29%' }}></p>
        <button onClick={toggleLogoGrid} style={{ zIndex: 2, position: 'fixed', left: '76%', height: 30 }}>
          {showLogoGrid ? "Hide" : "Show"} Coins
        </button>
        {showLogoGrid && (
          <div className="logo-grid">
            <button onClick={toggleLogoGrid} style={{ zIndex: 2, backgroundColor: 'grey', color: 'lightyellow', fontWeight: 'bold' }}>
              {showLogoGrid ? "Hide" : "Show"} Coins
            </button>
            {toOptions.map((option, i) => (
              <div
                key={i}
                className="logo-container"
                onClick={() => {
                  setTo(option)
                  toggleLogoGrid()
                }
                }
              >
                <CoinLogo coinAllCode={option} />
                {i == 20 ?
                  <div className='logo-label'>
                    <p>Standard Token</p>
                    <p style={{ position: 'relative', bottom: '15%'}}>Protocol</p>
                  </div> : <div className='logo-label'>{option}</div>
                }
              </div>
            ))}
          </div>
        )}

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
