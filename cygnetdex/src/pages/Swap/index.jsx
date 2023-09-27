import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../../tokenList.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import getBaseInfo from "src/api/getBaseInfo";
import queryCoinList from "src/api/queryCoinList";
import { initialState } from "src/types/types";
import getAccountInfo from "src/api/getAccountInfo";
import { useSelector } from "react-redux";
import getAccountCurrencies from "src/api/getAccountCurrencies";
import createXummPayload from "src/api/createXummPayload";
import getAccountBalance from "src/api/getAccountBalance";
import convertHexCurrencyToString from "src/utils/convertHexCurrencyToString";
import { Client, xrpToDrops, dropsToXrp } from "xrpl";
import getXrplAccountBalance from "src/api/getXrplAccountBalance";
import filterTokensByUserCoinsHeld from "src/utils/filterTokensByUserCoinsHeld";
import calculateExpectedReceivedQuantity from "src/utils/calculateExpectedReceivedQuantity";
import './styles.scss';
import actualTo from "src/api/getExhangeAmount";
import { TextField } from "@mui/material";
import createXummSwap from "src/api/createXummSwap";

// Now need to via the Swap button, initialise a function that creates an order on the SWFT API, 
// with the returnAddr in the returned parameters, we will trigger a payload using the XUMM API
// this will trigger a push notification on their application to authorise the payment

function Swap(props) {
  const { address, isConnected } = props; // get logged in user address and pass it in as a prop
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState('');
  const [tokenTwoAmount, setTokenTwoAmount] = useState(0);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalTwoOpen, setModalTwoOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });
  const [from, setFrom] = useState("XRSWAN");
  const [to, setTo] = useState("ETH");
  const [accountInfo, setAccountInfo] = useState(null);
  const [accountCurrencies, setAccountCurrencies] = useState();
  const [userTokensAndBalances, setUserTokensAndBalances] = useState();
  const [expectedReceiveQuantity, setExpectedReceiveQuantity] = useState(0);
  const [currenciesHeld, setCurrenciesHeld] = useState();
  const [depositCoinAmt, setDepositCoinAmt] = useState("1.0");

  const [toOptions, setToOptions] = useState([]);
  // 0x2Fef78405Ef60fC4f1A18f1C6838f8149d970118
  const [receivingAddress, setReceivingAddress] = useState(
    ""
  );

  const [coins, setCoins] = useState([]);
  const [showLogoGrid, setShowLogoGrid] = useState(false);

  const [baseInfo, setBaseInfo] = useState(null);
  const [receiveCurrencies, setReceiveCurrencies] = useState([]);
  const [sendCurrencies, setSendCurrencies] = useState([]);

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: txDetails.to,
      data: txDetails.data,
      value: txDetails.value,
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  let host = process.env.REACT_APP_HOST;
  let sourceFlag = process.env.REACT_APP_SOURCE_FLAG;

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  function changeAmount(e) {
    console.log("changeAmount e", e);
    setTokenOneAmount(e.target.value);
    if (e.target.value && prices) {
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    // fetchPrices(two.address, one.address);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function openModalTwo(asset) {
    setChangeToken(asset);
    setModalTwoOpen(true);
  }

  function modifyToken(i, modal) {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);

    if (modal === 'first') {
      setTokenOne(displayTokens[i]);
      setIsOpen(false);
    } else if (modal === 'second') {
      setTokenTwo(tokenList[i]);
      setModalTwoOpen(false);
    }
  }

  async function fetchPrices(one, two) {
    const res = await axios.get(`http://localhost:3001/tokenPrice`, {
      params: { addressOne: one, addressTwo: two },
    });

    setPrices(res.data);
  }

  async function fetchDexSwap() {
    // 
  }

  const handleSubmit = async () => {
    console.log("submitted");
    console.log('dep min', baseInfo);

    const baseMinerFee = baseInfo?.minerFee;
    const receiveCoinFee = baseInfo?.receiveCoinFee;

    let depositMinAmt = baseInfo?.depositMin;
    let depositMaxAmt = baseInfo?.depositMax;
    let instantRateAmt = baseInfo?.instantRate;

    console.log("baseMinerFee", baseMinerFee);
    console.log('receiveCoinFee', receiveCoinFee);

    try {
      // Calculate the actual exchange amount using the actualTo function
      const depositCoinAmt = 1.0; // Replace this with the actual deposit coin amount
      const depositMin = depositMinAmt;
      const depositMax = depositMaxAmt;
      const instantRate = instantRateAmt;
      const minerFee = {
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
        depositCoinCode: tokenOne.ticker,
        receiveCoinCode: tokenTwo.ticker,
        depositCoinAmt: tokenOneAmount,
        receiveCoinAmt: expectedReceiveQuantity,
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
          depositCoinCode: tokenOne.ticker,
          receiveCoinCode: tokenTwo.ticker,
          depositCoinAmt: parseFloat(tokenOneAmount),
          receiveCoinAmt: expectedReceiveQuantity,
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
      console.log('plat addr', data.data.platformAddr);
      if (data.resCode === '800') {

        createXummSwap(data.data.platformAddr, tokenOneAmount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(async ()=>{
  //   console.log(tokenList[0].address, tokenList[1].address)
  //   let pricesResult = await fetchPrices(tokenList[0].address, tokenList[1].address)

  //   console.log('pricesResult', pricesResult)
  // }, [])

  // useEffect(()=>{

  //     if(txDetails.to && isConnected){
  //       sendTransaction();
  //     }
  // }, [txDetails])

  // useEffect(()=>{

  //   messageApi.destroy();

  //   if(isLoading){
  //     messageApi.open({
  //       type: 'loading',
  //       content: 'Transaction is Pending...',
  //       duration: 0,
  //     })
  //   }

  // },[isLoading])

  // useEffect(()=>{
  //   messageApi.destroy();
  //   if(isSuccess){
  //     messageApi.open({
  //       type: 'success',
  //       content: 'Transaction Successful',
  //       duration: 1.5,
  //     })
  //   }else if(txDetails.to){
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Transaction Failed',
  //       duration: 1.50,
  //     })
  //   }

  // },[isSuccess])

  const handleFromSelectChange = async (event) => {
    setTokenOneAmount(event.target.value);
  };

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  let currentUser = useSelector((state) => state.currentUser);

  let equipmentNumber = currentUser?.user[0]?.account;
  console.log('equipmentNumber', equipmentNumber);

  useEffect(() => {
    try {
      const accountAddress = equipmentNumber;

      const fetchData = async () => {
        const [info, tokensAndBalances, currencies] = await Promise.all([
          getAccountInfo(accountAddress),
          getXrplAccountBalance(accountAddress),
          getAccountCurrencies(accountAddress)
        ]);

        // Process receive and send currencies
        const tempReceiveCurrencies = [];
        const tempSendCurrencies = [];

        for (let currency of currencies.receiveCurrencies) {
          tempReceiveCurrencies.push(convertHexCurrencyToString(currency));
        }

        for (let currency of currencies.sendCurrencies) {
          tempSendCurrencies.push(convertHexCurrencyToString(currency));
        }

        // Now update the states together to minimize renders
        setAccountInfo(info);
        setUserTokensAndBalances(tokensAndBalances);
        setAccountCurrencies(currencies);
        setReceiveCurrencies([...receiveCurrencies, ...tempReceiveCurrencies]);
        setSendCurrencies([...receiveCurrencies, ...tempReceiveCurrencies]);
      };

      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [equipmentNumber]);

  const extractedInformation = [];

  // Iterate through the assets object
  if (userTokensAndBalances) {
    for (const account in userTokensAndBalances.assets) {
      if (userTokensAndBalances.assets.hasOwnProperty(account)) {
        const accountAssets = userTokensAndBalances.assets[account];

        // Iterate through the assets for each account
        for (const asset of accountAssets) {
          const currency = asset.currency;
          const value = asset.value;

          // Add the extracted information to the array
          extractedInformation.push({ account, currency, value });
        }
      }
    }
  }
  console.log('tokenOne', tokenOne)
  const displayTokens = filterTokensByUserCoinsHeld(tokenList, sendCurrencies);
  const updatedTokenList = tokenList.filter(token => token.ticker !== tokenOne.ticker);

  useEffect(() => {
    const fetchBaseInfo = async () => {
      if (tokenOne && tokenTwo && tokenOneAmount > 0) {
        try {
          // Wait for the promise to resolve using await
          const info = await getBaseInfo(tokenOne.ticker, tokenTwo.ticker, tokenOneAmount);
          setBaseInfo(info.data);
          let receiveQuantity = calculateExpectedReceivedQuantity(tokenOneAmount, baseInfo);
          console.log('INFO', receiveQuantity);
          setExpectedReceiveQuantity(receiveQuantity);
        } catch (error) {
          console.error("Failed to get base info:", error);
        }
      }
    };

    // Call the async function
    fetchBaseInfo();
  }, [tokenOne, tokenTwo, tokenOneAmount]);

  const roundedExpectedQuantity = parseFloat(expectedReceiveQuantity.toFixed(6));

  const handleReceivingAddressChange = (
    event
  ) => {
    setReceivingAddress(event.target.value);
  };
  console.log('RECEIVE', expectedReceiveQuantity);

  console.group('User Account Information')
  console.log("Account Info: ", accountInfo);
  console.log("Account Currencies: ", accountCurrencies);
  console.log('Receive Currencies: ', receiveCurrencies);
  console.log('Send Currencies: ', sendCurrencies);
  console.log('User Tokens and Balances: ', userTokensAndBalances);
  console.log('Base Info: ', baseInfo);
  console.log('Receiving Address: ', receivingAddress);
  console.groupEnd();

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {displayTokens?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i, 'first')}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <Modal
        open={modalTwoOpen}
        footer={null}
        onCancel={() => setModalTwoOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {updatedTokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i, 'second')}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <h3 className='balances-title'>Balances</h3>
      <div className='balances-container'>
        <div className='balances'>
          {extractedInformation.map((info, index) => (

            <div className="balance-info" key={index}>
              <p>{convertHexCurrencyToString(info.currency)}</p>
              <p>{info.value}</p>
            </div>

          ))}
        </div>
      </div>

      <div className="tradeBoxContainer">
        <div className="tradeBox">
          <div className="tradeBoxHeader">
            <h4 style={{ color: "white" }}>Swap</h4>
            <Popover
              content={settings}
              title="Settings"
              trigger="click"
              placement="bottomRight"
            >
              <SettingOutlined className="cog" />
            </Popover>
          </div>
          <div className="inputs">
            <Input
              placeholder="0"
              value={tokenOneAmount}
              onChange={handleFromSelectChange}
            //disabled={!prices}
            />
            <Input placeholder="0" value={roundedExpectedQuantity} disabled={true} />
            <div className="switchButton" onClick={switchTokens}>
              <ArrowDownOutlined className="switchArrow" rev={undefined} />
            </div>
            <div className="assetOne" onClick={() => openModal(1)}>
              <img
                src={displayTokens[0]?.img}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {displayTokens[0]?.ticker}
              <DownOutlined rev={undefined} />
            </div>
            <div className="assetTwo" onClick={() => openModalTwo(2)}>
              <img
                src={tokenTwo.img}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {tokenTwo.ticker}
              <DownOutlined rev={undefined} />
            </div>
          </div>
          {baseInfo ? (
            <div className="baseInfoSection">
              <div className="infoItem">
                <p style={{ flex: 'start' }}>Estimated Rate:</p>
                <p style={{ flex: 'end' }}>{baseInfo.instantRate} {tokenTwo.ticker}</p>
              </div>
              <div className="infoItem">
                <p style={{ flex: 'start' }}>Service Fee:</p>
                <p style={{ flex: 'end' }}>{baseInfo.depositCoinFeeRate} %</p>
              </div>
              <div className="infoItem">
                <p style={{ flex: 'start' }}>Relayer Service Fee:</p>
                <p style={{ flex: 'end' }}>{baseInfo.chainFee} {tokenTwo.ticker}</p>
              </div>
              {setExpectedReceiveQuantity ? <div className="receiveItem">
                <p style={{ flex: 'start' }}>You Will Receive:</p>
                <p style={{ flex: 'end' }}>{roundedExpectedQuantity} {tokenTwo.ticker}</p>
              </div> : null}

            </div>
          ) : null}
          <TextField
            id="standard-basic"
            label="Receiving Address"
            variant="standard"
            className="receiving"
            value={receivingAddress}
            onChange={handleReceivingAddressChange}
          />
          <p>*NOTE: PLEASE USE NON-EXCHANGE ADDRESSES ONLY*</p>

          <div
            className="swapButton"
            disabled={!tokenOneAmount}
            onClick={handleSubmit}
          >
            Swap
          </div>
        </div>
      </div>
    </>
  );
}

export default Swap;
