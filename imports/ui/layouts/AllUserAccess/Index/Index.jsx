import React from 'react';
import { Link } from 'react-router-dom';

import './Index.scss';

const Index = (props) => (
  <div className="Index">
    <h1>App Boilerplate!</h1>
    <p>Already have an account? <Link to="/login">Log In</Link>.</p>
    <p>Or <Link to="/login">Create New Account</Link>.</p>
  </div>
);

export default Index;
