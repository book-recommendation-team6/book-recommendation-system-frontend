import React, { useState } from 'react';
import { ConfigProvider, Button, Flex, Table } from 'antd';

const columns = [
  { title: 'Họ và tên', dataIndex: 'name' },
  { title: 'User id', dataIndex: 'userId' },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Ngày tạo', dataIndex: 'createdDate' },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (text) => (
      <span
        className={
          text === 'Đang hoạt động'
            ? 'text-teal-500 font-medium'
            : text === 'Bị khóa'
            ? 'text-red-500 font-medium'
            : 'text-gray-500'
        }
      >
        {text}
      </span>
    ),
  },
  {
    title: 'Hành động',
    dataIndex: '',
    key: 'x',
    render: () => <Button color="danger" variant="outlined">Ban</Button>,
  },
];


const UserTable = ({ users, onLockUser }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = newSelectedRowKeys => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Flex gap="middle" vertical>
      <Flex align="center" gap="middle">
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Flex>
      <ConfigProvider
        theme={{
          components: {
            Table: {
             headerBg: '#D9D9D9',
            },
          },
        }}
      >
      <Table rowSelection={rowSelection}  pagination={{ position: ['bottomCenter'], size: 'middle' }} columns={columns} dataSource={users} size="middle"/>
      </ConfigProvider>
    </Flex>

  )
}

export default UserTable;

    // <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
    //   <table className="w-full">
    //     <thead>
    //       <tr className="bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
    //         <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên</th>
    //         <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">User Id</th>
    //         <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
    //         <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Ngày tạo</th>
    //         <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</th>
    //         <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Hành động</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {users.map((user, index) => (
    //         <tr
    //           key={user.id || index}
    //           className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
    //         >
    //           <td className="px-6 py-4">
    //             <div className="flex items-center gap-3">
    //               {/* <Avatar className="w-8 h-8">
    //                 <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
    //                 <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
    //               </Avatar> */}
    //               <span className="text-sm text-gray-900 dark:text-gray-100">{user.name}</span>
    //             </div>
    //           </td>
    //           <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.userId}</td>
    //           <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
    //           <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.createdDate}</td>
    //           <td className="px-6 py-4">
    //             <span className="text-sm text-cyan-500 dark:text-cyan-400">{user.status}</span>
    //           </td>
    //           <td className="px-6 py-4">
    //             <button
    //               variant="outline"
    //               size="sm"
    //               onClick={() => onLockUser(user.id)}
    //               className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
    //             >
    //               Khóa tài khoản
    //             </button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
