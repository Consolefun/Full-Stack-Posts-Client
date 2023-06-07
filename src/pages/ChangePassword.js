import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function ChangePassword() {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    let navigate = useNavigate();
    const changePassword = () => {
        axios.put("http://localhost:3001/auth/changepassword", {
            oldPassword: oldPassword,
            newPassword: newPassword,
        }, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            }
            else {
                //Redirect to main page
                navigate("/");
            }
        });


    };
    return (
        <div>
            <h1>Change your password</h1>
            <input type="text" placeholder='Old password...'
                onChange={(event) => {
                    setOldPassword(event.target.value);
                }}
            ></input>
            <input type="text" placeholder='New password...'
                onChange={(event) => {
                    setNewPassword(event.target.value);
                }}
            ></input>
            <button className="changePassword" onClick={changePassword}> Save Changes</button>
        </div>
    )
}

export default ChangePassword;
