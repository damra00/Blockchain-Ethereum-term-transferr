import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from 'antd';
import { InputNumber } from 'antd';
import ReactDOM from "react-dom/client";
import { useParams } from 'react-router-dom';


const App3: React.FC = () => <Input placeholder="Basic usage" />;


const AddBalance = () => {

const onChange = (value: number) => {  setAddpay(value); };

const [addpay, setAddpay] = useState(0);
const params = useParams()
console.log(params.address)

    return (
     
       <div>
           <> 
    </>
          <p>AddBalance Page</p>
          <p><Link to="/">Go home</Link></p>
          <p><Link to="/asset">Go Asset</Link></p>
         Eklenmek Istediğiniz Miktar(ETH) <InputNumber  onChange={onChange} />;
          
           <button type="button" >Onayla</button>

       <h1>"{params.address}"    adresine   {addpay}(ETH)"  eklendi</h1>
       </div>
    )
 }

 export default AddBalance;