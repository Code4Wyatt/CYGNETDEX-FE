import React from 'react';

interface Props {
  coinAllCode: string;
}

const CoinLogo: React.FC<Props> = ({ coinAllCode }) => {
  try {
    if (coinAllCode.startsWith(' ')) {
        const CoinLogo = require(`../../assets/images/coinLogos/${coinAllCode}.png`);
    }
    const CoinLogo = require(`../../assets/images/coinLogos/${coinAllCode}.png`);
    return <img src={CoinLogo} alt={`${coinAllCode} logo`} style={{ height: '40px', width: '40px', borderRadius: '50%', position: 'relative', top: '5px' }} />;
  } catch (err) {
    return <option value={coinAllCode}>{coinAllCode}</option>;
  }
};

export default CoinLogo;






