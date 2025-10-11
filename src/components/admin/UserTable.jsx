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
             headerBg: '#E7E7E7',
            },
          },
        }}
      >
      <Table rowSelection={rowSelection}  pagination={{ position: ["bottomCenter"],  size: "large" }} columns={columns} dataSource={users} size="large"/>
      </ConfigProvider>
    </Flex>

  )
}

export default UserTable;

