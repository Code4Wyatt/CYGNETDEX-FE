import axios from "axios";

interface AccountBalanceResponse {
  data: {
    coinCode: string;
    availableAmount: string;
    freezeAmount: string;
  }[];
  resCode: string;
  resMsg: string;
}

const getSignature = async () => {
    try {
        const response = axios.get('http://localhost:3001/xumm/getSignature');
        return response;
    } catch (error) {
        console.log('getAccountBalance getSignature error', error);
    }
}

const getAccountBalance = async (
  channelId: string,
  sign: string,
  timestamp: string
): Promise<AccountBalanceResponse | null> => {
  try {
    let signature = await getSignature;
    
    const host = 'http://localhost:3001/xumm'; // Replace with your actual host URL
    const url = `${host}/getAccountBalance?channelId=${channelId}&sign=${sign}&timestamp=${timestamp}`;

    const response = await axios.get(url);

    const responseData = response.data;
    if (responseData && responseData.data) {
      // Parse the response data as needed
      return responseData as AccountBalanceResponse;
    } else {
      console.error('Unexpected response format:', responseData);
      return null;
    }
  } catch (error) {
    console.error('Error fetching account balance:', error);
    return null;
  }
};

export default getAccountBalance;
