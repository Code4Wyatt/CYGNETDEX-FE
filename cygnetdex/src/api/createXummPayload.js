import { useSelector } from 'react-redux';
import { XummPkce, XummPkceEvent } from 'xumm-oauth2-pkce';
import {XummSdk} from 'xumm-sdk';

var sdk = new XummSdk('3fc00c1e-2478-4696-810d-f6e432f64b96', '6ba46924-3662-473b-8ddd-97ef60a280da');

  
export default function go_payload(destination, amount) {
    /**
      * xumm-oauth2-pkce package returns `sdk` property, 
      * allowing access to the Xumm SDK (`xumm-sdk`) package.
      * Xumm SDK methods, docs:
      *      https://www.npmjs.com/package/xumm-sdk
      **/

    var request = {
        TransactionType: 'Payment',
        Destination: destination,
        Amount: amount
    }
    const payload = sdk.payload.create(request, true);

    console.log('payload PAYLOAD', payload)
  }