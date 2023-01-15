import React from "react";
import './ErrorIndicator.css';
import picture from './oops_f.png'

const ErrorIndicator = () => {
    return(
        <div className="error">
            <span className="error__msg">
                Somthing has gone wrong!
            </span>
            <img src={picture} alt='oops'></img>
        </div>
    )
}

export default ErrorIndicator;