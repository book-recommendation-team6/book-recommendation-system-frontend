import React from 'react';
import { ConfigProvider, Table, Button } from 'antd';

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

const UserTable = ({
  users,
  onLockUser,
  pagination,
  onTableChange,
  loading: tableLoading,
  selectedRowKeys = [],
  onSelectionChange,
}) => {
  const columns = [
    { title: 'Username', dataIndex: 'username', render: (_, record) => record.username || record.name || '-' },
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
  const rowSelection = onSelectionChange
    ? {
        selectedRowKeys,
        onChange: onSelectionChange,
      }
    : undefined;
  return (
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

  )
}

export default UserTable;
