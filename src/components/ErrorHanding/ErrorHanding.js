import React from 'react';
import { Alert, Space } from 'antd';
import './ErrorHanding.css';

function Error() {
    return (
        <Space direction='vertical' style={{ width: '100%' }}>
            <Alert
                className='error-alert'
                message='Error'
                description='Somthing has gone wrong! Try to reloading the page or check your Internet connection.'
                type='error'
                showIcon
            />
        </Space>
    );
}

export default Error;
