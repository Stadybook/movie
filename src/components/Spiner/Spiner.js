import React from "react";
import './Spiner.css';
import { Spin } from 'antd';

function Spiner(){  
    return ( 
          <div className="spiner">
            <Spin tip="Loading..." size="large" />
          </div>
        )
  }

export default Spiner;

