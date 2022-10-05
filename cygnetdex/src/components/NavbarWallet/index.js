import * as React from 'react';
import './styles.scss';
import { XummPkce } from 'xumm-oauth2-pkce';
import { addCurrentUserAction } from "../../redux/actions/UserAction";
import { useSelector, connect, useDispatch } from "react-redux";



function NavbarWallet(props) {
  let dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser.user);
/**
    * Construct & handle async (mobile)
    **/
var auth = new XummPkce('3fc00c1e-2478-4696-810d-f6e432f64b96')
var sdk = null

auth.on('result', event => {
  // Redirect, e.g. mobile. Mobile may return to new tab, this
  // handles the same logic (re-inits the auth Promise) normally
  // triggered by e.g. a button.
  //   > Note: it emulates without opening another auth window ;)
  console.log('Results are in, mobile flow, emulate auth trigger')
  go()
})

/**
 * UI stuff
 **/
var signinbtn = document.getElementById('signinbtn')

function reset() {
  // signinbtn.innerText = 'Sign in'
  // document.getElementById('signedin').style.display = 'none'
  // document.getElementById('error').style.display = 'none'
  // document.getElementById('trypayload').style.display = 'none'
}

// Start in default UI state
reset()

/**
 * Fn to deal with a "Sign In" button click or redirect
 **/
function go() {

  reset()
  // signinbtn.innerText = 'Signing in...'

  return auth
    .authorize()
    .then(authorized => {
      // Assign to global, please don't do this but for the sake of the demo it's easy
      sdk = authorized.sdk

      console.log('Authorized', /* authorized.jwt, */ authorized.me)
      dispatch(addCurrentUserAction(authorized.me))
      // signinbtn.style.display = 'none'

      // document.getElementById('signedin').style.display = 'block'

      var resultspre = document.getElementById('results')

      resultspre.style.display = 'block'
      resultspre.innerText = JSON.stringify(authorized.me, null, 2)
      document.getElementById('trypayload').style.display = 'block'

      sdk.ping().then(pong => console.log({ pong }))
    })
    .catch(e => {
      console.log('Auth error', e)

      reset()

      // document.getElementById('error').style.display = 'block'
      // document.getElementById('error').innerText = e.message
    })
}

function go_payload() {
  /**
    * xumm-oauth2-pkce package returns `sdk` property, 
    * allowing access to the Xumm SDK (`xumm-sdk`) package.
    * Xumm SDK methods, docs:
    *      https://www.npmjs.com/package/xumm-sdk
    **/

  var payload = {
    txjson: {
      TransactionType: 'Payment',
      Destination: 'rfCarbonVNTuXckX6x2qTMFmFSnm6dEWGX',
      Amount: '1337' // Drops, so: 0.001337 XRP
    }
  }

  sdk.payload.createAndSubscribe(payload, function (payloadEvent) {
    if (typeof payloadEvent.data.signed !== 'undefined') {
      // What we return here will be the resolved value of the `resolved` property
      return payloadEvent.data
    }
  }).then(function ({ created, resolved }) {
    if (created.pushed) {
      alert('Now check Xumm, there should be a push notification + sign request in your event list waiting for you ;)')
    } else {
      alert('Now check Xumm, there should be a sign request in your event list waiting for you ;) (This would have been pushed, but it seems you did not grant Xumm the push permission)')
    }

    resolved.then(function (payloadOutcome) {
      alert('Payload ' + (payloadOutcome.signed ? 'signed (TX Hash: ' + payloadOutcome.txid + ')' : 'rejected') + ', see the browser console for more info')
      console.log(payloadOutcome)
    })
  }).catch(function (payloadError) {
    alert('Paylaod error', payloadError.message)
  })
}
  return (
    <div className='wallet-container'>
      <div className='status'>
        {currentUser.length > 0 ? <p style={{color: '#72ff26'}}>.</p> : <p style={{color: '#ff0303'}}>.</p>}
      </div>
      <div className='button' onClick={() => go()}>
        {currentUser.length > 0 ? 'Wallet Connected' :' Connect Wallet' }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(NavbarWallet);
