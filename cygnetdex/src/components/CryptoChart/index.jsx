import { useState, useEffect } from "react";
import TradingViewWidget from "react-tradingview-widget";

const CryptoChart = () => {
  const [data, setData] = useState([]);

  const options = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  };

  useEffect(() => {
    try {
      async function fetchData() {
        const response = await fetch(
          "https://api.onthedex.live/public/v1/ohlc?base=CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr&quote=XRP&bars=100&interval=60",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          }
        );
        const json = await response.json();
        setData([json]);
      }
      fetchData();
      console.log("dataaa", data);
    } catch (error) {
      console.log("fetchData error", error);
    }
  }, []);

  let base = "BTC";
  console.log("!!!!!!!!base", base);
  let quote = data[0]?.spec?.quote;
  let symbol = `CRYPTOCAP:${base}/${quote}`;
  const reformattedData = data.map((point) => {
    return {
      time: point.t,
      open: point.o,
      high: point.h,
      low: point.l,
      close: point.c,
      volume: point.vb,
      quote_volume: point.vq,
    };
  });

  console.log(symbol);
  return (
    <div>
      {data.length > 0 && (
        <TradingViewWidget
          symbol={symbol}
          interval="60"
          data={reformattedData}
          height={400}
          width={1000}
        />
      )}
    </div>
  );
};

export default CryptoChart;
