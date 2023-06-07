
// import { React, useState } from 'react'
// import axios from 'axios';

// function UserEditModal({ user, onSave, onClose }) {
//     const [userPic, setUserPic] = useState(null);

//     const handleSaveFile = (updatedUser) => {

//         setUserPic(updatedUser.target.files[0]);
//     };

//     const handleSave = () => {

//         const formData = new FormData();
//         formData.append('image', userPic);

//         axios.post('http://localhost:3001/users/profilePicture', formData)
//             .then((response) => {
//                 console.log("Image uploaded successfully");
//             })
//             .catch((error) => {
//                 console.error("Error Uploading image: ", error);
//             });

//         onSave({ ...user, userPic: userPic });


//         console.log(userPic);
//         onClose();
//     };

//     const handleCancel = () => {
//         onClose();
//     };

//     return (
//         <div className='modal'>
//             <div className='modal-content'>

//                 <form action='/upload' method='post' encType='multipart/form-data'>

//                     <input type="file" name="image" value={userPic} onChange={(e) =>
//                         handleSaveFile(e.target.value)} />

//                 </form>

//                 <div className='modal-buttons'>
//                     <button onClick={handleCancel}>Cancel</button>
//                     <button onClick={handleSave}>Save</button>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default UserEditModal;


import React from "react";

function UserEditModal({ children }) {
    return (
        <div className="modal">
            <div className="modal-header">
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}

export default UserEditModal;
