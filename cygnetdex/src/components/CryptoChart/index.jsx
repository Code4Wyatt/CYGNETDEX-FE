import "./styles.scss";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Line } from 'react-chartjs-2';
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import Chart from 'chart.js/auto';

export const CryptoChart = (props) => {
  const [cryptoTimeData, setCryptoTimeData] = useState([]);
  const [xrpTimeData, setXrpTimeData] = useState([]);
  const [days, setDays] = useState('60');
  const [currency, setCurrency] = useState('XRSWAN');

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();
  const fetchCryptoStats = async () => {
    try {
      let response = await fetch(
        `https://api.onthedex.live/public/v1/ohlc?base=XRSWAN.rUHoc9nQyZzahE5rq26QHkvBmnvCEoPAhZ&quote=XRP&bars=100&interval=60`
      );
      let data = await response.json();
      console.log("cryptoStats", data);
      setCryptoTimeData(data.data.ohlc);

    } catch (error) {
      console.log(error);
    }
  };
  const fetchXrpStats = async () => {
    try {
      let response = await fetch(
        `https://api.onthedex.live/public/v1/ohlc?base=XRP&quote=XRSWAN.rUHoc9nQyZzahE5rq26QHkvBmnvCEoPAhZ&bars=100&interval=60`
      );
      let data = await response.json();
      console.log("xrp?", data);
      setXrpTimeData(data.data.ohlc);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCryptoStats();
    fetchXrpStats();
  }, []); // Dependencies will be days and currencies

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <div className={classes.container}>
          {!cryptoTimeData ? (
            <CircularProgress
              style={{ color: "gold" }}
              size={250}
              thickness={1}
            />
          ) : (
            <>
             
              <div className="chart1">
              <Line
                data={{
                  labels: cryptoTimeData.map((coin) => {
                    // console.log(coin)
                    let unixTimestamp = coin.t;
                    let date = new Date(unixTimestamp * 1000);
                    let days = 60;
                    let hours = date.getHours();
                    let minutes = "0" + date.getMinutes();
                    let seconds = "0" + date.getSeconds();
                    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                    // console.log(formattedTime);
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 60 ? formattedTime : date.toLocaleDateString();
                  }),

                  datasets: [
                    {
                      data: cryptoTimeData.map((coin) => coin.o),
                      label: `Price ( Past ${days} Days ) in ${currency}`,
                      borderColor: "#db0d1e",
                    },
                  ],
                }}
                options={{
                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                }}
              />
              </div>
              <div className='chart2'>      <Line
                data={{
                  labels: xrpTimeData.map((coin) => {
                    console.log(coin)
                    let unixTimestamp = coin.t;
                    let date = new Date(unixTimestamp * 1000);
                    let days = 60;
                    let hours = date.getHours();
                    let minutes = "0" + date.getMinutes();
                    let seconds = "0" + date.getSeconds();
                    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                    console.log(formattedTime);
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 60 ? formattedTime : date.toLocaleDateString();
                  }),

                  datasets: [
                    {
                      data: xrpTimeData.map((coin) => coin.c),
                      label: `Price ( Past ${days} Days ) in XRP`,
                      borderColor: "#EEBC1D",
                    },
                  ],
                }}
                options={{
                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                }}
               
              /></div>
        

              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                {/* {chartDays.map((day) => (
                  <SelectButton
                    key={day.value}
                    onClick={() => {
                      setDays(day.value);
                      setflag(false);
                    }}
                    selected={day.value === days}
                  >
                    {day.label}
                  </SelectButton>
                ))} */}
              </div>
            </>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CryptoChart);
