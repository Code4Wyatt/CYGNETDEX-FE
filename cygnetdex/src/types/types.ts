import { initialState } from "../redux/store"

interface initialState {
    currentUser: {
        user: []
    }
}

interface AccountExchangeRequest {
    depositCoinCode: string
    receiveCoinCode: string
    depositCoinAmt: string
    receiveCoinAmt: string
    destinationAddr: string
    refundAddr: string
    equipmentNo: string
    sourceType: string
    sourceFlag: string
    length: number
}

interface DataResponse {
    data: Array<any>
    resCode: string
    resMsg: string
    length: number
}

export type { initialState, AccountExchangeRequest, DataResponse }
