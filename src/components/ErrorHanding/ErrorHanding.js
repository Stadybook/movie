import React from "react";
import { Alert, Space } from 'antd';
import './ErrorHanding.css'

function Error (){ 
    return(
      <React.Fragment>
         <Space direction="vertical" style={{ width: '100%' }}>
         <Alert
            message="Error"
            description="Somthing has gone wrong! Unable to load data. Check your Internet connection"
            type="error"
            showIcon
          />
         </Space>
      </React.Fragment>
    )
}

export default Error;