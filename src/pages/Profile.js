import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../helpers/AuthContext";
import UserEditModal from './UserEditModal';
import '../../node_modules/font-awesome/css/font-awesome.min.css'
import { BsCamera } from "react-icons/bs";
import { useFormik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';

function Profile() {
    let { id } = useParams();
    let navigate = useNavigate();
    let imageUrl = "";
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const { authState } = useContext(AuthContext);

    const [showEditModal, setShowEditModal] = useState(false);
    //const [imageUrl, setImageUrl] = useState("");
    const [imageData, setImageData] = useState("");

    const [currentUser, setCurrentUser] = useState({
        username: username,
        profilePicture: "",
    });
    const formik = useFormik({

        initialValues: {
            newUserName: username,
        },
        validationSchema: Yup.object().shape({
            newUserName: Yup.string().min(3).max(15).required(),
        }),
        onSubmit: async (values) => {


            const formDataToSend = new FormData();
            // if (currentUser.profilePicture == "profilePicture") {
            //     formDataToSend.append("profilePicture", imageData);
            // }
            formDataToSend.append("profilePicture", imageData);

            try {
                await axios.put(`http://localhost:3001/auth/basicinfo/${id}/profilePicture`, formDataToSend,
                    {
                        headers: {
                            accessToken: localStorage.getItem("accessToken"),
                            "Content-Type": "multipart/form-data",

                        },
                    }
                );


                await axios.put(`http://localhost:3001/auth/basicinfo/${id}/userName`,
                    {
                        newUserName: values.newUserName,
                        id: id

                    },

                    {
                        headers: { accessToken: localStorage.getItem("accessToken") },
                    }
                );

                await axios.put(`http://localhost:3001/posts/byuserId/${id}/userName`,
                    {
                        newUserName: values.newUserName,
                        UserId: id
                    },
                    {
                        headers: { accessToken: localStorage.getItem("accessToken") },
                    }
                )

                setCurrentUser({ ...currentUser, profilePicture: formDataToSend });
                setUsername(values.newUserName);
                setShowEditModal(false);


            } catch (error) {
                console.log("Error updating profile picture:", error);
            }
            window.location.reload(true);

        }
    });


    const handleEditClick = () => {
        setShowEditModal(true);
    }


    const handleCloseModal = () => {
        setShowEditModal(false);
    }

    const handleSaveUser = (event) => {

        if (event.target.name === "profilePicture") {

            setImageData(event.target.files[0]);

            console.log(listOfPosts[0].username);


        }

    };


    useEffect(() => {


        axios.get("http://localhost:3001/auth/verifyToken", {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        })
            .then((response) => {
                console.log(response.data.message); // "Token is valid"
            })
            .catch((error) => {
                console.log(error.response.data.error); // "User not logged in!"
            });

        axios.get(`http://localhost:3001/auth/basicinfo/${id}`)
            .then((response) => {
                setUsername(response.data.username);

                imageUrl = response.data.profilePicture.substr(76);

                setCurrentUser({ ...currentUser, profilePicture: imageUrl });

            });

        axios.get(`http://localhost:3001/posts/byuserId/${id}`)
            .then((response) => {
                setListOfPosts(response.data);
            })

        //console.log(listOfPosts);



    }, [id]);



    return (
        <div className="profilePageContainer">
            <div className='basicInfo'>
                {" "}
                {/* <img src={imageUrl} alt='profilePicture' /> */}
                {currentUser.profilePicture !== null ? <img src={`http://localhost:3000/${currentUser.profilePicture}`} alt="Uploading picture" /> : <p>No image</p>}
                {authState.username == username && (
                    <button className='editUserInfo' onClick={handleEditClick}>Edit</button>
                )}


                {showEditModal && (

                    <UserEditModal>


                        <form onSubmit={formik.handleSubmit}>
                            <div className='userPhoto' style={{ position: "relative" }}>
                                <label htmlFor='profilePicture'>

                                    <img className='imgUpload' src={`http://localhost:3000/${currentUser.profilePicture}`} />


                                    <BsCamera style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

                                    <input
                                        id='profilePicture'
                                        type="file"
                                        name="profilePicture"
                                        accept='image/*'
                                        onChange={handleSaveUser}
                                        style={{ display: "none" }} />
                                </label>

                            </div>
                            <div>
                                <label htmlFor='newUsername'>User Name:</label>
                                <input
                                    id='newUserName'
                                    name='newUserName'
                                    type='text'
                                    placeholder={`${username}`}
                                    value={formik.values.newUserName}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='uploadPicBtns'>
                                <button type='submit' disabled={!formik.isValid || formik.isSubmitting}>Update User</button>
                                <button onClick={handleCloseModal}>Close</button>
                            </div>
                        </form>
                    </UserEditModal>
                )}


                {/* {authState.username === username && (
                    <button
                        onClick={() => {
                            navigate("/changepassword")
                        }}
                    >
                        Change My Password
                    </button>
                )} */}
            </div>

            <div className='listOfPosts'>
                {listOfPosts.map((value, key) => {
                    return (
                        <div key={key}
                            className="post">
                            <div className="title"> {value.title}</div>
                            <div
                                className="body"
                                onClick={() => {
                                    navigate(`/post/${value.id}`)
                                }}
                            >
                                {value.postText}
                            </div>
                            <div className="footer">
                                <div className='username'>{value.username}</div>
                                <div className='buttons'>

                                    <label>{value.Likes.length}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Profile;