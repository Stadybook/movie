import React from "react";
import { Alert, Space } from 'antd';
import './ErrorHanding.css'

function Error (){ 
    return(
      <React.Fragment>
         <Space  direction="vertical" style={{ width: '100%'}}>
         <Alert
            className="error-alert"
            message="Error"
            description="Somthing has gone wrong! We are already trying fix it"
            type="error"
            showIcon
          />
         </Space>
      </React.Fragment>
    )
}

export default Error;