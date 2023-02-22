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

    let navigate = useNavigate();
    useEffect(() => {
        axios.get(`https://fullstack-posts.herokuapp.com/posts/byId/${id}`).then((Response) => {
            setPostObject(Response.data);

        });

        axios.get(`https://fullstack-posts.herokuapp.com/comments/${id}`).then((Response) => {

            setComments(Response.data)
        });
    }, []);

    const addComment = () => {
        axios.post(
            "https://fullstack-posts.herokuapp.com/comments",
            {
                commentBody: newComment,
                PostId: id,
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
                    username: response.data.username,
                    id: response.data.id,
                };
                setComments([...comments, commentToAdd]);
                setNewComment("");
            }

        });
    };

    const deleteComment = (id) => {
        axios
            .delete(`https://fullstack-posts.herokuapp.com/comments/${id}`, {
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
        axios.delete(`https://fullstack-posts.herokuapp.com/posts/${id}`, {
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
                axios.put("https://fullstack-posts.herokuapp.com/posts/title",
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
                axios.put("https://fullstack-posts.herokuapp.com/posts/postText",
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
                                {comment.commentBody}
                                <label> Username: {comment.username}</label>
                                {authState.username === comment.username && (
                                    <button onClick={() => {
                                        deleteComment(comment.id);
                                    }}> X </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;
