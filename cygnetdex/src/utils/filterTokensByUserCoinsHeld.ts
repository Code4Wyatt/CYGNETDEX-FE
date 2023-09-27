interface Token {
    img: string;
    ticker: string;
    name: string;
}

const filterTokensByExtractedInformation = (
    tokenList?: Token[], 
    extractedInformation?: string[]
): Token[] => {
    if (!tokenList || !extractedInformation) return [];
    console.log('filterTokensByExtractedInformation', {
        tokenList, extractedInformation 
    })
    return tokenList.filter(token => extractedInformation.includes(token.ticker));
};

export default filterTokensByExtractedInformation;

