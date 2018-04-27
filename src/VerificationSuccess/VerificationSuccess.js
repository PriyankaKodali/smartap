import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class VerificationSuccess extends Component {


    render() {
        return (

            <div style={{ margin: "0 10px", height: "auto", padding: "10px", "textAlign": "center" }} >
                <div style={{ display: "table", margin: "0 auto" }}>
                    <div style={{ display: "tableCell", "verticalAlign": "middle" }}>
                        <img src="../Images/logo_color.png" alt="logo"/>
                    </div>
                    <div style={{ display: "table-cell", "verticalAlign": "middle", "textAlign": "center", color: "#484848" }}>
                        <h2 style={{ "paddingLeft": "0 !important", "textTransform": "uppercase", "fontSize": "20px", "lineHeight": "28px", margin: "0" }}>Smart Village - Smart Ward</h2>
                        <h2 style={{ "paddingLeft": "0 !important", "textTransform": "uppercase", "fontSize": "20px", "lineHeight": "28px", margin: "0" }}>Towards Smart Andhra Pradesh</h2>
                    </div>
                </div>
                <hr style={{ margin: "0" }} />
                <h3><strong>Your email and mobile has been verified successfully</strong></h3>
                <p>Please login and complete your profile to finish your registration</p>
                <Link to="/login"> <button className="btn btn-success">Login</button></Link>
            </div>

        );
    }


}

export default VerificationSuccess;

