import axios from 'axios';

interface Asset {
    currency: string;
    value: string;
  }
  
  interface Assets {
    [key: string]: Asset[];
  }
  
  interface Data {
    assets: Assets;
    account: string;
    ledger_index: number;
    ledger_hash: string;
  }

const getXrplAccountBalance = async (accountAddress: String): Promise<Data | null> => {
  try {
    const response = await axios.post('http://localhost:3001/xumm/gateway_balances', {
        method: "gateway_balances",
        params: [
            {
                account: accountAddress,
                ledger_index: "validated",
                strict: true
            }
        ]
    });

    // Check if the response contains the expected data structure
    const responseData = response.data;
    if (responseData && responseData.result && responseData.result.assets) {
      const accountInfo: Data = {
        account: responseData.result.account,
        assets: responseData.result.assets,
        ledger_hash: responseData.result.ledger_hash,
        ledger_index: responseData.result.ledger_index
        // Map other fields as needed
      };
      return accountInfo;
    } else {
      // Handle unexpected response format
      console.error('Unexpected response format:', responseData);
      return null;
    }
  } catch (error) {
    // Handle any errors that occur during the HTTP request
    console.error('Error connecting to Ripple API:', error);
    return null;
  }
};

export default getXrplAccountBalance;
