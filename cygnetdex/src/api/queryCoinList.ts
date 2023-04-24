import axios from "axios"

interface Coin {
    name: string
    symbol: string
    price: number
}

const queryCoinList = async () => {
    let host = process.env.REACT_APP_HOST

    try {
        let params = {
            "supportType": "advanced",
            "mainNetwork": "",
        }

        const response = await axios.post(
            `${host}/api/v1/queryCoinList`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )

        let coinList = await response.data

        console.log('fetchAccountBalances coins', coinList)

        return coinList
    } catch (error) {

        console.error(error)
        return []
    }
};

export default queryCoinList;