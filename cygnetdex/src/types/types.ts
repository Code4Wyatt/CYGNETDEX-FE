import { initialState } from "../redux/store";

interface User {
  account: String;
  blocked: boolean;
  domain: null | string;
  email: String;
  force_dtag: boolean;
  kycApproced: boolean;
  name: null | string;
  networkEndpoint: String;
  networkType: String;
  picture: String;
  proSubscription: boolean;
  source: String;
  sub: String;
}

interface initialState {
  currentUser: {
    user: User[];
  };
}

interface Coin {
  coinAllCode: String;
  coinCode: String;
  coinDecimal: 8;
  contact: String;
  isSupportAdvanced: String;
  isSupportMemo: String;
  mainNetwork: String;
  noSupportCoin: String;
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

interface DataResponse {
  data: Array<any>;
  resCode: string;
  resMsg: string;
  length: number;
}

interface TokenList {
  ticker: string,
  img: string,
  name: string
}

export type { initialState, Coin, AccountExchangeRequest, DataResponse };
