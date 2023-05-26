import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
       <div>
          <p>Home Page</p>
          <p><Link to="/asset">Asset</Link></p>
          <p><Link to="/transfer">Transfer</Link></p>
       </div>
    )
 }

 export default Home;