import axios from "axios";

const getAccountInfo = async (xrpAddress: String) => {
  try {
    const data = await axios({
      method: 'post',
      url: 'https://s1.ripple.com:51234/',
      headers: {'Content-Type': 'application/json'},
      data: {
        "id": 1,
        "method": "account_info",
        "params": [
            {
                "account": xrpAddress,
                "ledger_index": "current",
                "queue": true
            }
        ]
    }
    })
  } catch (error) {
    console.error('Error connecting to XRP Ledger:', error)
  }
};

export default getAccountInfo;
