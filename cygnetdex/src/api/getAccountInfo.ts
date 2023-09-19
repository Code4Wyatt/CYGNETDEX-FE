import axios from 'axios';

interface AccountInfo {
  // Define the structure of the account info here based on your API response
  // For example:
  account: string;
  balance: number;
  // Add more fields as needed
}

const getAccountInfo = async (accountAddress: String): Promise<AccountInfo | null> => {
  try {
    const response = await axios.post('http://localhost:3001/xrpl/account_info', {
      method: 'account_info',
      params: [
        {
          account: accountAddress,
          strict: true,
          ledger_index: 'validated',
          api_version: 1,
        },
      ],
    });

    // Check if the response contains the expected data structure
    const responseData = response.data;
    if (responseData && responseData.result && responseData.result.account_data) {
      const accountInfo: AccountInfo = {
        account: responseData.result.account_data.Account,
        balance: responseData.result.account_data.Balance,
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

export default getAccountInfo;
