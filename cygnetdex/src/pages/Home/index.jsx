import { useState } from 'react'
import { connect } from 'react-redux'
import './styles.scss'
import ValueBar from '../../components/ValueBar'
import OptionsPanel from '../../components/OptionsPanel'

export const Home = (props) => {
 const [xrswanValue, setXrswanValue] = useState('');
 const [xrpValue, setXrpValue] = useState('');
 const [xrswanTitle, setXrswanTitle] = useState('');
 const [xrpTitle, setXrpTitle] = useState('');

  const fetchXrswanValues = async () => {
    try {
      const xrswanValues = await fetch(`https://api.onthedex.live/public/v1/ticker/XRSWAN.rUHoc9nQyZzahE5rq26QHkvBmnvCEoPAhZ:XRP`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000'
        },
      });
      let response = await xrswanValues.json();
      console.log('xrswan', response);
      setXrswanTitle(response.pairs[0].base.currency);
      setXrswanValue(response.pairs[0].last);
      console.log(xrswanValue);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchXrpValues = async () => {
    try {
      const xrpValues = await fetch(`https://api.onthedex.live/public/v1/ticker/XRP:XRSWAN.rUHoc9nQyZzahE5rq26QHkvBmnvCEoPAhZ`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000'
        },
      });
      let response = await xrpValues.json();
      console.log('xrp', response);
      setXrpTitle(response.pairs[0].base);
      setXrpValue(response.pairs[0].last);
      console.log(xrpValue);
    } catch (error) {
      console.log(error);
    }
  }
  fetchXrswanValues();
  fetchXrpValues();
  return (
    <>
    {xrswanValue && xrswanTitle ? <ValueBar title={xrswanTitle} value={xrswanValue}  /> : 'Loading'}
    {xrpValue && xrpTitle ? <ValueBar title={xrpTitle} value={xrpValue} /> : 'Loading'}
    <OptionsPanel />
    </>
    
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
