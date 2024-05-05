import Navbar from "../Navbar";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [followedUsers, setFollowedUsers] = useState([]);
    const token = Cookies.get('token');

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/all', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            
            const data = await response.json();
            setUsers(data || []);
            
            const followingUsers = data.filter(user => user.followers.includes(loggedInUser));
        
            setFollowedUsers(followingUsers || []);
            console.log(followedUsers)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]); 

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedInUser(decodedToken.userId);
            console.log(loggedInUser);
        } else {
            setLoggedInUser(null);
        }
    }, []);

    const handleSearchChange = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setSearchInput(inputValue);
    }

    const filteredUsers = users.filter((user) => {
        return user.username.toLowerCase().includes(searchInput);
    });

    const handleFollow = async (targetUserId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/follow/${targetUserId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the user's JWT token for authentication
                }
            });

            setUsers(prevUsers => {
                return prevUsers.map(user => {
                    if (user._id === targetUserId) {
                        return { ...user, followers: [...user.followers, loggedInUser] };
                    }
                    return user;
                });
            });
    
            if (response.ok) {
                console.log('User followed successfully');
            } else {
                const errorData = await response.json();
                console.error('Follow user error:', errorData.message || 'Failed to follow user');
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async (targetUserId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/unfollow/${targetUserId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the user's JWT token for authentication
                }
            });

            setUsers(prevUsers => {
                return prevUsers.map(user => {
                    if (user._id === targetUserId) {
                        return { ...user, followers: user.followers.filter(id => id !== loggedInUser) };
                    }
                    return user;
                });
            });
    
            if (response.ok) {
                console.log('User unfollowed successfully');
            } else {
                const errorData = await response.json();
                console.error('Unfollow user error:', errorData.message || 'Failed to unfollow user');
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };


    return (
        <div className="App">
            <Navbar />
            <div>
                <div className="row m-0">
                    <div className="searchBar my-2 d-flex justify-content-center">
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search for users"
                                onChange={handleSearchChange}
                                value={searchInput}
                            />
                        </div>
                    </div>
                    {filteredUsers.map(user => (
                        <div key={user._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div className="card recipe-card" style={{ maxWidth: "360px" }}>
                                <h5 className="card-title text-center">{user.username}</h5>
                                <div className="profile-picture-container d-flex justify-content-center align-items-center">
                                    <img
                                        src={user.profilePicture}
                                        className="card-img-top img-fluid rounded-circle"
                                        alt={user.username}
                                        style={{ height: "200px", width: "200px", objectFit: "cover" }}
                                    />
                                </div>
                                {user._id !== loggedInUser ? (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button
                                            className={`btn ${user.followers.includes(loggedInUser) ? "btn-danger" : "btn-success"}`}
                                            onClick={() => user.followers.includes(loggedInUser) ? handleUnfollow(user._id) : handleFollow(user._id)}
                                            style={{ width: "100px", marginTop: "10px" }}
                                        >
                                            {user.followers.includes(loggedInUser) ? "Unfollow" : "Follow"}
                                        </button>
                                    </div>
                                ) : null}
                                <div className="card-body text-center">
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ViewUsers;