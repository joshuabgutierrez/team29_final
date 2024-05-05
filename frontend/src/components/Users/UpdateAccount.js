import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function UpdateAccount() {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newBio, setNewBio] = useState('');
    const [newPFP, setNewPFP] = useState('');

    const token = Cookies.get('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        } else {
            navigate('/login');
        }
    }, []);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = {
                username: newUsername,
                email: newEmail,
                bio: newBio, 
                profilePicture: newPFP
            };
    
            await fetch(`http://localhost:5000/api/users/update/${userId}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedUser)
            });

            alert("Your information has been updated.");
            
            if (newUsername.trim() !== '') {
                localStorage.setItem('username', newUsername);
            }
            if (newEmail.trim() !== '') {
                localStorage.setItem('email', newEmail);
            }
            if (newBio.trim() !== '') {
                localStorage.setItem('bio', newBio);
            }
            if (newPFP.trim() !== '') {
                localStorage.setItem('profilePicture', newPFP);
            }

            navigate('/account'); 
        } catch (error) {
            console.error('ERROR:', error);
        }

    };

    

    return (
        <div>
          <Navbar />
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h1 className="card-title text-center mb-4">Update Account</h1>
                    <form onSubmit={handleUpdateUser}>
                      <div className="mb-3">
                        <label htmlFor="newUsername" className="form-label">Username:</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="newUsername" 
                          value={newUsername} 
                          onChange={(e) => setNewUsername(e.target.value)} 
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newEmail" className="form-label">Email:</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="newEmail" 
                          value={newEmail} 
                          onChange={(e) => setNewEmail(e.target.value)} 
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newBio" className="form-label">Bio:</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="newBio" 
                          value={newBio} 
                          onChange={(e) => setNewBio(e.target.value)} 
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newPFP" className="form-label">Profile Picture:</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="newPFP" 
                          value={newPFP} 
                          onChange={(e) => setNewPFP(e.target.value)} 
                        />
                      </div>
                      <div className="text-center mt-3">
                      <button type="submit" className="btn btn-success">Update</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default UpdateAccount;