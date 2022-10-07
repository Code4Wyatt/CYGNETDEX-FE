import "./styles.scss";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import TradeViewChart from "react-crypto-chart";

export const CryptoChart = (props) => {
  useEffect(() => {
    const fetchCryptoStats = async () => {
      try {
        let response = await fetch(
          `https://api.onthedex.live/public/v1/ohlc?base=XRSWAN.rUHoc9nQyZzahE5rq26QHkvBmnvCEoPAhZ&quote=XRP&bars=100&interval=60`
        );
        let data = await response.json();
        console.log("cryptoStats", data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCryptoStats();
  }, []);

  return (
    <>
      <div className="crypto-chart">
        <TradeViewChart
          containerStyle={{
            minHeight: "300px",
            minWidth: "400px",
            marginBottom: "30px",
            backgroundColor: 'blue'
          }}
          pair="XRPBTC"
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CryptoChart);
