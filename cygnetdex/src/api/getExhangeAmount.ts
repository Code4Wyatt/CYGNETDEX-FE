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

const depositMax = 100000;
const depositMin = 10;
const instantRate = 0.00000048597; // For SWFTC to BTC exchange
const minerFee = 0.001; // For SWFTC to BTC exchange
const receiveCoinFee = 0.000059; // For SWFTC to BTC exchange

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

  export default actualTo;
