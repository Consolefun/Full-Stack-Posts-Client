import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from "../helpers/AuthContext";


function Post() {

    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState({
        username: authState.username,
        profilePicture: "",
    });
    let idUser = 0;
    let navigate = useNavigate();
    useEffect(() => {

        axios.get(`http://localhost:3001/posts/byId/${id}`).then((Response) => {
            setPostObject(Response.data);

        });

        axios.get(`http://localhost:3001/comments/${id}`).then((Response) => {

            setComments(Response.data)
        });
        comments.filter(function (comment) {

            axios.get(`http://localhost:3001/auth/basicinfo/${comment.UserId}`)
                .then((response) => {
                    //setUsername(response.data.username);
                    const imageUrl = response.data.profilePicture.substr(76);

                    setCurrentUser({ ...currentUser, profilePicture: imageUrl });

                });
        })
        // axios.get(`http://localhost:3001/auth/basicinfo/${authState.id}`)
        //     .then((response) => {
        //         //setUsername(response.data.username);
        //         const imageUrl = response.data.profilePicture.substr(76);

        //         setCurrentUser({ ...currentUser, profilePicture: imageUrl });

        //     });

    }, []);

    const addComment = () => {

        axios.post(
            "http://localhost:3001/comments",
            {
                commentBody: newComment,
                PostId: id,
                UserId: authState.id,

            },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            }
        ).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            }
            else {
                const commentToAdd = {
                    commentBody: newComment,
                    username: authState.username,
                    id: response.data.id,
                };
                setComments([...comments, commentToAdd]);
                setNewComment("");
            }

        });
        //need to fix this
        comments.filter(function (comment) {
            console.log(comment.UserId);

            axios.get(`http://localhost:3001/auth/basicinfo/${comment.UserId}`)
                .then((response) => {
                    //setUsername(response.data.username);
                    const imageUrl = response.data.profilePicture.substr(76);

                    setCurrentUser({ ...currentUser, profilePicture: imageUrl });

                });
        })
    };

    const deleteComment = (id) => {
        axios
            .delete(`http://localhost:3001/comments/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            }).then(() => {
                setComments(
                    comments.filter((val) => {
                        return val.id !== id;
                    })
                );
            });
    };

    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
        }).then(() => {
            navigate("/");
        });
    };

    const editPost = (option) => {
        if (option === "title") {
            let newTitle = prompt("Enter New Title:");
            if (newTitle === null) {
                return;
            }
            else {
                axios.put("http://localhost:3001/posts/title",
                    {
                        newTitle: newTitle,
                        id: id
                    },
                    {
                        headers: { accessToken: localStorage.getItem("accessToken") },
                    }
                );

                setPostObject({ ...postObject, title: newTitle });
            }

        } else {
            let newPostText = prompt("Enter New Text:");
            if (newPostText === null) {
                return;
            }
            else {
                axios.put("http://localhost:3001/posts/postText",
                    {
                        newText: newPostText,
                        id: id
                    },
                    {
                        headers: { accessToken: localStorage.getItem("accessToken") },
                    }
                );
                setPostObject({ ...postObject, postText: newPostText });
            }

        }
    }
    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title"
                        onClick={() => {
                            if (authState.username === postObject.username) {
                                editPost("title");
                            }
                        }}
                    >
                        {postObject.title}{" "}
                    </div>
                    <div className="body"
                        onClick={() => {
                            if (authState.username === postObject.username) {
                                editPost("body");
                            }
                        }}
                    >
                        {postObject.postText}{" "}</div>
                    <div className="footer">
                        {postObject.username}
                        {authState.username === postObject.username && (
                            <button
                                onClick={() => {
                                    deletePost(postObject.id);
                                }}
                            >
                                {" "}
                                Delete Post
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="rightSide">
                <div className='addCommentContainer'>

                    <input
                        type="text"
                        placeholder='Comment...'
                        autoComplete='off'
                        value={newComment}
                        onChange={(event) => {
                            setNewComment(event.target.value);
                        }}
                    />
                    <button onClick={addComment}> Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (

                            <div key={key} className="comment">
                                <div className="comment-header">

                                    <div className='username'>
                                        {comment.username}
                                    </div>
                                    {authState.username === comment.username && (
                                        <button className='delete-button' onClick={() => {
                                            deleteComment(comment.id);
                                        }}> X </button>
                                    )}
                                </div>
                                <div className='comment-body'>
                                    {comment.commentBody}
                                </div>
                            </div>

                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;
