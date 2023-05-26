import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from 'antd';
import { InputNumber } from 'antd';
import ReactDOM from "react-dom/client";
import { useParams } from 'react-router-dom';
const App3: React.FC = () => <Input placeholder="Basic usage" />;


const Withdraw = () => {

const onChange = (value: number) => {  setWdraw(value); };

const [wdraw, setWdraw] = useState(0);
const params = useParams()
console.log(params.address)

    return (
     
       <div>
           <> 
    </>
          <p>Withdraw Page</p>
          <p><Link to="/">Go home</Link></p>
          <p><Link to="/asset">Go Asset</Link></p>
          
          Çekmek Istediğiniz Miktar(ETH) <InputNumber  onChange={onChange} />;
          
           <button type="button" >Onayla</button>

       <h1>"{params.address}"    adresinden  {wdraw}(ETH)"  çekildi</h1>
       </div>
    )
 }

 export default Withdraw;