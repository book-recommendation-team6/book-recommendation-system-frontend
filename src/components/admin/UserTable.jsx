import React, { useState } from 'react';
import { ConfigProvider, Button, Table } from 'antd';

const UserTable = ({ users, onLockUser, pagination, onTableChange, loading: tableLoading }) => {
  const columns = [
    { title: 'Họ và tên', dataIndex: 'username', render: (_, record) => record.username || record.name || '-' },
    { title: 'User id', dataIndex: 'id' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (text) => new Date(text).toLocaleDateString() },
    {
      title: 'Trạng thái',
      dataIndex: 'activate',
      render: (text, record) => {
        const value = typeof record.activate !== 'undefined' ? record.activate : text;
        const isActive =
          value === true || value === 'true' || value === 1 || value === '1' || String(value).toLowerCase() === 'active' || String(value).toLowerCase() === 'activated';
        return (
          <span className={isActive ? 'text-teal-500 font-medium' : 'text-red-500 font-medium'}>
            {isActive ? 'Đã xác thực' : 'Chưa xác thực'}
          </span>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Button type="primary" danger onClick={() => onLockUser(record.id)}>
          Ban
        </Button>
      ),
    },
  ];
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
             headerBg: '#E7E7E7',
            },
          },
        }}
      >
      <Table
        rowKey={(record) => record.id}
        rowSelection={rowSelection}
        pagination={pagination}
        onChange={onTableChange}
        loading={tableLoading}
        columns={columns}
        dataSource={users}
        size="large"
      />
      </ConfigProvider>
    </div>

  )
}

export default UserTable;

