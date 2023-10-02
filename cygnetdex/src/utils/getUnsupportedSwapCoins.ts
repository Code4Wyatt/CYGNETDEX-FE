interface Coin {
    coinAllCode: string;
    coinCode: string;
    coinImageUrl: string;
    coinName: string;
    contact: string;
    isSupportAdvanced: string;
    mainNetwork: string;
    noSupportCoin: string;
}

interface SwapCoin {
    ticker: string,
    image: string,
    name: string,
    address: string,
    decimals: number
}

const getUnsupportedCoins = (swapCoin: SwapCoin, coinList: Coin[]): string[] => {
    console.log('get unsupported params', {swapCoin, coinList})
    // Find the coin in the coinList that matches the swapCoin
    const coin = coinList.find(item => item.coinCode === swapCoin.ticker);

    // If the coin is found and has the noSupportCoin property, split the string by commas to get the unsupported coins
    if (coin && coin.noSupportCoin) {
        return coin.noSupportCoin.split(',');
    }

    // If the coin is not found or doesn't have the noSupportCoin property, return an empty array
    return [];
};

export default getUnsupportedCoins;