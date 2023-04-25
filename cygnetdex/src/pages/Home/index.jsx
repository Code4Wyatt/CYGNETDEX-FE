import { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./styles.scss";
import ValueBar from "../../components/ValueBar";
import OptionsPanel from "../../components/OptionsPanel";
import CryptoChart from "../../components/CryptoChart";
import ClipLoader from "react-spinners/ClipLoader";

<script
  defer
  src="https://www.livecoinwatch.com/static/lcw-widget.js"
></script>;

export const Home = (props) => {
  const [xrswanValue, setXrswanValue] = useState([]);
  const [xrpValue, setXrpValue] = useState([]);
  const [xrswanTitle, setXrswanTitle] = useState([]);
  const [xrpTitle, setXrpTitle] = useState([]);
  const [xrswanTrend, setXrswanTrend] = useState([]);
  const [xrpTrend, setXrpTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchXrswanValues = async () => {
    try {
      const xrswanValues = await fetch(
        `https://api.onthedex.live/public/v1/ticker/XRSWAN.rUHoc9nQyZzahE5rq26QHkvBmnvCEoPAhZ:XRP`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        }
      );
      let response = await xrswanValues.json();
      console.log("fetchXrswanValues", response);
      setXrswanTitle(response.pairs[0].base.currency);
      setXrswanValue(response.pairs[0].last);
      setXrswanTrend(response.pairs[0].trend);
      setLoading(false);
      console.log('xrswanValue', xrswanValue);
    } catch (error) {
      console.log('fetchXrswanValues error', error);
    }
  };
  const fetchXrpValues = async () => {
    try {
      const xrpValues = await fetch(
        `https://api.onthedex.live/public/v1/ticker/XRP:XRSWAN.rUHoc9nQyZzahE5rq26QHkvBmnvCEoPAhZ`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        }
      );
      let response = await xrpValues.json();
      console.log("fetchXrpValues", response);
      setXrpTitle(response.pairs[0].base);
      setXrpValue(response.pairs[0].last);
      setXrpTrend(response.pairs[0].trend);
      setLoading(false);
      
    } catch (error) {
      console.log('fetchXrpValues error', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchXrswanValues();
      fetchXrpValues();
    }, 1000);
    console.log(xrpValue);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {loading === true ? (
        <>
          {" "}
          <div className="loading">
            <ClipLoader
              color="red"
              loading={loading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>{" "}
        </>
      ) : (
        <>
          <div className="main">
            <div
              className="livecoinwatch-widget-5"
              lcw-base="USD"
              lcw-color-tx="#999999"
              lcw-marquee-1="coins"
              lcw-marquee-2="movers"
              lcw-marquee-items="10"
            ></div>
            {xrswanValue && xrswanTitle ? (
              <ValueBar
                title={xrswanTitle}
                value={xrswanValue}
                trend={xrswanTrend}
              />
            ) : (
              "Loading"
            )}
            {xrpValue && xrpTitle ? (
              <ValueBar
                title={xrpTitle}
                value={xrpValue}
                trend={xrpTrend}
                className="value-bar"
              />
            ) : (
              "Loading"
            )}
            <OptionsPanel />
              <CryptoChart />
             
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
