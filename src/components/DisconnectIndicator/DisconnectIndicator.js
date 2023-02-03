import React from 'react';
import { Alert, Space } from 'antd';
import './DisconnectIndicator.css';

function DisconnectIndicator() {
    return (
        <Space direction='vertical' style={{ width: '100%' }}>
            <Alert
                message='Warning'
                description='This is a warning notice about problems with internet connection'
                type='warning'
                showIcon
                closable
                className='warning-alert'
            />
        </Space>
    );
}

export default DisconnectIndicator;
