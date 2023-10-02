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

const filterTokensByUnsupportedCoins = (tokens: Coin[], unsupportedCoins: string[]): Coin[] => {
    console.log('TOKENS', tokens);

    let filteredTokens: Coin[] = [];

    for (let i = 0; i < tokens.length; i++) {
        if (!unsupportedCoins.includes(tokens[i].coinCode)) {
            filteredTokens.push(tokens[i]);
        }
    }

    return filteredTokens;
};

export default filterTokensByUnsupportedCoins;
