import './styles.scss';
import React from 'react'
import { connect } from 'react-redux'

export const OptionsPanel = (props) => {
  return (
    <div className='options-panel'>
        <div className='option'>
            <p>Trade</p>
        </div>
        <div className='option'>
            <p>Spotlight</p>
        </div>
        <div className='option'>
            <p>All Tokens</p>
        </div>
        <div className='option'>
            <p>Top Gainers</p>
        </div>
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsPanel)