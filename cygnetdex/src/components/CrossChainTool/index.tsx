import "./style.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import cygnetdexlogo from "../../assets/images/logo.png";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { initialState, AccountExchangeRequest, DataResponse } from '../../types/types';
import queryCoinList from '../../api/queryCoinList';
import getBaseInfo from "../../api/getBaseInfo";
import getAccountInfo from '../../api/getAccountInfo';
import CoinLogo from '../CoinLogo';
import { useAccount, useSendTransaction } from "wagmi";
import { sendTransaction, prepareSendTransaction } from '@wagmi/core'
import { parseEther } from 'viem'

interface Coin {
  coinAllCode: string,
  coinCode: string,
  coinDecimal: number,
  contact: string,
  isSupportAdvanced: string,
  isSupportMemo: string,
  mainNetwork: string,
  noSupportCoin: string
}

type DepositRate = {
  depositMin: number;
  depositMax: number;
};

type ConversionRate = {
  instantRate: number;
};

type MinerFee = {
  minerFee: number;
  receiveCoinFee: number;
};

const AccountExchangeComponent: React.FC = () => {
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);

  const [from, setFrom] = useState<string>("XRSWAN");
  const [to, setTo] = useState<string>("ETH");

  const [depositCoinAmt, setDepositCoinAmt] = useState('1.0');

  const [toOptions, setToOptions] = useState<string[]>([
  ]);

  const [receivingAddress, setReceivingAddress] = useState<string>("0x2Fef78405Ef60fC4f1A18f1C6838f8149d970118");

  const [coins, setCoins] = useState<any[]>([]);
  const [showLogoGrid, setShowLogoGrid] = useState(false);

  const [baseInfo, setBaseInfo] = useState<any>(null);

  let currentUser = useSelector(
    (state: initialState) => state.currentUser
  );

  let equipmentNumber = currentUser?.user[0]?.account;

  const getUserAccountInfo = async (equipmentNumber: String) => {
    let accountInfo = await getAccountInfo(equipmentNumber);

    if (accountInfo !== undefined && accountInfo !== null) {
      console.log('User Account Info: ', accountInfo);
      return accountInfo;
    }
  }

  let host = process.env.REACT_APP_HOST;
  let sourceFlag = process.env.REACT_APP_SOURCE_FLAG;

  console.log("currentUser", currentUser?.user[0]?.account);
  console.log("to", to);
  console.log("from", from);

  useEffect(() => {
    getUserAccountInfo(equipmentNumber);
  }, [equipmentNumber]);

  useEffect(() => {
    if (depositCoinAmt) {
      async function getBaseInfoRequest() {
        let baseInfo = await getBaseInfo(from, to, depositCoinAmt);
        baseInfo && setBaseInfo(baseInfo);
        return baseInfo;
      }
      getBaseInfoRequest();
    }
  }, [depositCoinAmt]);

  console.log("baseInfo", baseInfo);

  const toggleLogoGrid = () => {
    setShowLogoGrid(!showLogoGrid);
  };

  const handleFromSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let coinList = await queryCoinList();
    let coinListValues = coinList.data.map((coin: Coin) => ({
      coinAllCode: coin.coinAllCode,
      coinCode: coin.coinCode,
    }));
    console.log(coinListValues);
    setFrom(value);
    setToOptions(coinListValues);

    console.log('from', value);

  };

  console.log(from);
  console.log('coinList', toOptions);

  const handleToSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTo(value);
  };

  const actualTo = (
    depositCoinAmt: number,
    depositMin: number,
    depositMax: number,
    instantRate: number,
    minerFee: MinerFee
  ): number => {
    return (
      depositCoinAmt -
      depositCoinAmt *
      (depositMin / (depositMax - depositMin)) *
      instantRate -
      minerFee.minerFee -
      minerFee.receiveCoinFee
    );
  };

  const handleReceivingAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceivingAddress(event.target.value);
  };

  const handleSubmit = async () => {
    console.log("submitted");
    console.log('dep min', baseInfo);

    const baseMinerFee = baseInfo?.data.minerFee;
    const receiveCoinFee = baseInfo?.data.receiveCoinFee;

    let depositMinAmt = baseInfo?.data.depositMin;
    let depositMaxAmt = baseInfo?.data.depositMax;
    let instantRateAmt = baseInfo?.data.instantRate;

    console.log("baseMinerFee", baseMinerFee);
    console.log('receiveCoinFee', receiveCoinFee);

    try {
      // Calculate the actual exchange amount using the actualTo function
      const depositCoinAmt = 1.0; // Replace this with the actual deposit coin amount
      const depositMin = depositMinAmt; 
      const depositMax = depositMaxAmt; 
      const instantRate = instantRateAmt; 
      const minerFee: MinerFee = {
        minerFee: baseMinerFee ? baseMinerFee : 0, 
        receiveCoinFee: receiveCoinFee ? receiveCoinFee : 0,
      };

      const actualExchangeAmount = actualTo(
        depositCoinAmt,
        depositMin,
        depositMax,
        instantRate,
        minerFee
      );

      console.log('actualExchangeAmount', actualExchangeAmount);

      console.log("Request Parameters:", {
        depositCoinCode: from,
        receiveCoinCode: to,
        depositCoinAmt: depositCoinAmt.toString(),
        receiveCoinAmt: '0.003278',
        destinationAddr: "0x2Fef78405Ef60fC4f1A18f1C6838f8149d970118",
        refundAddr: equipmentNumber,
        equipmentNo: equipmentNumber,
        sourceType: "H5",
        sourceFlag: sourceFlag,
        actualExchangeAmount: actualExchangeAmount,
      });

      const request = await fetch(`${host}/api/v2/accountExchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositCoinCode: from,
          receiveCoinCode: to,
          depositCoinAmt: depositCoinAmt.toString(),
          receiveCoinAmt: '0.003278',
          destinationAddr: "0x2Fef78405Ef60fC4f1A18f1C6838f8149d970118",
          refundAddr: equipmentNumber,
          equipmentNo: equipmentNumber,
          sourceType: "H5",
          sourceFlag: sourceFlag,
          actualExchangeAmount: actualExchangeAmount,
        }),
      });

      const data = await request.json();
      console.log("DATAAAAAAAAAAAA", data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (baseInfo) {
      // Use the baseInfo data to perform further actions or update the state
      console.log("Base info:", baseInfo);
    }
  }, [baseInfo]);

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
                }}>
                {/* <CoinLogo coinAllCode={option} /> */}
               
                  <div className='logo-label'>
                    <p>Standard Token</p>
                    <p style={{ position: 'relative', bottom: '15%' }}>Protocol</p>
                  </div> : <div className='logo-label'>{option}</div>
              
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
        onClick={() => handleSubmit()}
      >
        SWAP NOW
      </button>
    </div>
  );
};

export default AccountExchangeComponent;
