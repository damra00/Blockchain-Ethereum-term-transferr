import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputNumber } from 'antd';
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import { Input } from 'antd';




const Transfer = () => {
  
  const onChange2: DatePickerProps['onChange'] = (date, dateString) => {
   console.log(date, dateString);
 };
 
const [date, setDate] = useState("");
const [address, setAddress] = useState("");
const onChange = (value: number) => {  setPay(value); };
const [pay, setPay] = useState(0);

    return (
      
       <div>
           <p>Transfer Page</p>
          <p><Link to="/">Go home</Link></p>
         Gönderilecek adres<Input onChange={(e)=>setAddress(e.target.value)} placeholder ="gönderilecek adres" />;
         Kullanıma Açılacağı Tarih  <DatePicker onChange={(date,dateString)=>setDate(dateString)} />;
         Gönderilecek Miktar(ETH) <InputNumber  onChange={onChange} />;
         <button type="button" >Onayla</button>
         <h1>{date}"  tarihinde  {address}"  adresine  {pay}(ETH)"  gönderildi</h1>
       </div>
    )
 }

 export default Transfer;


  

