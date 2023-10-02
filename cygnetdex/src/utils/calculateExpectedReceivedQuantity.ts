export default function calculateExpectedReceivedQuantity(depositAmt: string, baseInfo: any) {
    console.log('calculateExpectedReceivedQuantity baseInfo', {depositAmt, baseInfo});

    const depositCoinAmt = parseFloat(depositAmt);
    console.log('depositCoinAmt:', depositCoinAmt);

    const depositCoinFeeRate = parseFloat(baseInfo.depositCoinFeeRate);
    console.log('depositCoinFeeRate:', depositCoinFeeRate);

    const instantRate = parseFloat(baseInfo.instantRate);
    console.log('instantRate:', instantRate);

    const chainFee = parseFloat(baseInfo.chainFee);
    console.log('chainFee:', chainFee);

    const depositAfterFee = depositCoinAmt - (depositCoinAmt * depositCoinFeeRate);
    const expectedQuantityBeforeChainFee = depositAfterFee * instantRate;
    const expectedQuantity = expectedQuantityBeforeChainFee - chainFee;

    return expectedQuantity;
}


// Usage:

