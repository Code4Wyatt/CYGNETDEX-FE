export default function convertHexCurrencyToString(hexCurrency: string): string {
    // Check if the input is a valid hexadecimal string
    // if (!/^[0-9A-Fa-f]{64}$/.test(hexCurrency)) {
    //   return 'Invalid input';
    // }

    // Find the position of the first backslash
    const backslashIndex = hexCurrency.indexOf('\\');

    // If a backslash is found, extract the portion of the string before it
    if (backslashIndex !== -1) {
        hexCurrency = hexCurrency.substring(0, backslashIndex);
    }

    // Remove null characters and surrounding white space
    hexCurrency = hexCurrency.replace(/\x00/g, '').trim();

    // Convert the hexadecimal string to ASCII characters
    const asciiChars: string[] = [];

    for (let i = 0; i < hexCurrency.length; i += 2) {
        const hexPair: string = hexCurrency.substring(i, i + 2);
        const asciiChar: string = String.fromCharCode(parseInt(hexPair, 16));
        asciiChars.push(asciiChar);
    }

    let currencyCode: string = '';

    for (let i = 0; i < asciiChars.length; i++) {
        if (asciiChars[i] !== '\x00') {
            currencyCode += asciiChars[i];
        }
    }

    return currencyCode;
}
