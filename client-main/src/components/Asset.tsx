import { Space, Table, Tabs } from 'antd';
import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;

interface Transaction {
   address: string;
   date: number;
   balance: number;
}

const data: Transaction[] = [
   {
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      date: 1660655874874,
      balance: 0,
   },
   {
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      date: 1660655874874,
      balance: 25,
   },
   {
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      date: 2660656874874,
      balance: 50,
   },
];


const Asset = () => {

   const getTableColumns = (isIncomeAsset: boolean) => {
      return [
         {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
         },
         {
            title: 'Unlock Date',
            dataIndex: 'date',
            key: 'date',
            render: (_, record) => (
               new Date(record.date).toLocaleDateString("tr-TR")
            )
         },
         {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
         },
         {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
               <Space size="middle">
                  {record.date < Date.now() && record.balance !== 0 && <a><Link to={"/Withdraw/"+record.address}>Withdraw</Link></a>}
                  {!isIncomeAsset && <a><Link to={"/AddBalance/"+record.address}>AddBalance</Link></a>}
               </Space>
            ),
         },
      ] as ColumnsType<Transaction>;
   }

   return (
      <>
         <div>
         <p>Asset Page</p>
            <p><Link to="/">Go home</Link></p>
         </div>
         <div className="card-container" style={{ padding: "25px" }}>
            <Tabs type="card">
               <TabPane tab="Income" key="1">
                  <Table columns={getTableColumns(true)} dataSource={data} />
               </TabPane>
               <TabPane tab="Outcome" key="2">
                  <Table columns={getTableColumns(false)} dataSource={data} />
               </TabPane>
            </Tabs>
         </div>
      </>
   )
}

export default Asset;