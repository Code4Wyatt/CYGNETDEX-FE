import React from 'react'
import { connect } from 'react-redux'
import './styles.scss'

export const ValueBar = (props) => {
    let xrswanValue = props.value;
    let title = props.title;
    let valueSliced = xrswanValue.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
    console.log(props)
  return (
    <div className={`circle ${
        title == 'XRP' ? "circle--online" : "circle--offline"
      }`}>{title} Price: {valueSliced}</div>
  )
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };

export default connect(mapStateToProps)(ValueBar)