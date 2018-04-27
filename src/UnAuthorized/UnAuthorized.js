import React, { Component } from 'react';

class UnAuthorized extends Component {
    render() {
        return (
            <div className="text-center">
                <h2>You do not have enough privileges to access this page!</h2>
                <p>Please contact administrator for additional information.</p>
            </div>
        );
    }
}

export default UnAuthorized;