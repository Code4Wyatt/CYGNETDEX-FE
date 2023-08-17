import axios from "axios"

interface BaseInfoParams {
    depositCoinCode: String
    receiveCoinCode: String
    depositCoinAmt: String
}

const getBaseInfo = async (depositCoinCode: String, receiveCoinCode: String, depositCoinAmt: String) => {
    let host = process.env.REACT_APP_HOST
    
    console.log('getBaseInfo params', {
        depositCoinCode,
        receiveCoinCode,
        depositCoinAmt
    })

    try {
        let params: BaseInfoParams = {
            "depositCoinCode": depositCoinCode,
            "receiveCoinCode": receiveCoinCode,
            "depositCoinAmt": depositCoinAmt
        }

        const response = await axios.post(
            `${host}/api/v1/getBaseInfo`,
            params,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        let baseInfo = await response.data

        console.log('getBaseInfo data', baseInfo)

        return baseInfo
    } catch (error) {
        console.error(error)

        return []
    }
}

export default getBaseInfo