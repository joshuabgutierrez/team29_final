import React from 'react';
import Navbar from './Navbar';

function About() {
    return (
        <div>
           <Navbar /> 
           <div className="container">
            <div className="card mt-3">
                <div className="card-body">
                    <div className="sub-container-custom">
                        <h1>The Developers & Info: </h1>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <h3>Course Name: </h3>
                            <p>COM S 319</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <h3>Students Names: </h3>
                            <p>Tristan Nono</p>
                            <p>Joshua Gutierrez</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <h3>Emails: </h3>
                            <p>nt0307e@iastate.edu</p>
                            <p>josh1015@iastate.edu</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <h3>Date: </h3>
                            <p>04/29/2024</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <h3>Professor's Name: </h3>
                            <p>Ali Jannesari</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default About;