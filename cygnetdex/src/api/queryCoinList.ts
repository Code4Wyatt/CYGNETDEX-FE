import axios from "axios"

interface QueryCoinListParams {
    supportType: String,
    mainNetwork?: String
}

const queryCoinList = async () => {
    let host = process.env.REACT_APP_HOST

    try {
        let params: QueryCoinListParams = {
            "supportType": "advanced",
            "mainNetwork": "ETH"
        }

        const response = await axios.post(
            `${host}/api/v1/queryCoinList`,
            params,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        let coinList = await response.data

        console.log('queryCoinList coins', coinList)

        return coinList
    } catch (error) {

        console.error(error)
        return []
    }
};

export default queryCoinList;