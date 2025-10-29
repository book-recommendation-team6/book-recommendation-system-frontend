import React, { useState } from 'react';
import { ConfigProvider, Button, Table } from 'antd';

const statusLabels = {
  ACTIVE: { text: 'Đã kích hoạt', className: 'text-teal-500 font-medium' },
  INACTIVE: { text: 'Chưa kích hoạt', className: 'text-orange-500 font-medium' },
  BANNED: { text: 'Bị ban', className: 'text-red-500 font-medium' },
  UNKNOWN: { text: 'Không xác định', className: 'text-gray-500 font-medium' },
};

const resolveStatusKey = (status) => {
  if (!status) {
    return 'UNKNOWN';
  }

  if (typeof status === 'string') {
    return status.trim().toUpperCase();
  }

  if (typeof status === 'object') {
    if (typeof status.name === 'string') {
      return status.name.trim().toUpperCase();
    }

    if (typeof status.value === 'string') {
      return status.value.trim().toUpperCase();
    }
  }

  return 'UNKNOWN';
};

const UserTable = ({ users, onLockUser, pagination, onTableChange, loading: tableLoading }) => {
  const columns = [
    { title: 'Họ và tên', dataIndex: 'username', render: (_, record) => record.username || record.name || '-' },
    { title: 'User id', dataIndex: 'id' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (text) => new Date(text).toLocaleDateString() },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value) => {
        const statusKey = resolveStatusKey(value);
        const status = statusLabels[statusKey] || statusLabels.UNKNOWN;
        return <span className={status.className}>{status.text}</span>;
      },
    },
    {
      title: 'Hành động',
      dataIndex: '',
      key: 'x',
      render: (_, record) => {
        const isBanned = resolveStatusKey(record.status) === 'BANNED';
        return (
          <Button
            type="primary"
            danger={!isBanned}
            onClick={() => onLockUser(record)}
          >
            {isBanned ? 'Bỏ chặn' : 'Chặn'}
          </Button>
        );
      },
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
