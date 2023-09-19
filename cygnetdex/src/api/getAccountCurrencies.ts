import axios from "axios";

interface getAccountCurrencies {
    ledgerHash: string;
    ledgerIndex: string;
    receiveCurrencies: string[];
    sendCurrencies: string[];
    validated: boolean;
}

const getAccountCurrencies = async (accountAddress: String): Promise<getAccountCurrencies | null> => {
    try {
      const response = await axios.post('http://localhost:3001/xrpl/account_currencies', {
        method: 'account_currencies',
        params: [
          {
            account: accountAddress,
            account_index: 0,
            ledger_index: 'validated'
          },
        ],
      });
  
      const responseData = response.data;
      if (responseData && responseData.result) {

        const accountCurrenciesInfo: getAccountCurrencies = {
          ledgerHash: responseData.result.ledger_hash,
          ledgerIndex: responseData.result.ledger_index,
          receiveCurrencies: responseData.result.receive_currencies,
          sendCurrencies: responseData.result.send_currencies,
          validated: responseData.result.validated
        };
        return accountCurrenciesInfo;
      } else {
        console.error('Unexpected response format:', responseData);
        return null;
      }
    } catch (error) {
      console.error('Error connecting to Ripple API:', error);
      return null;
    }
  };
  
  export default getAccountCurrencies;


