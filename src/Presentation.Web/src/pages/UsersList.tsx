/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table, Checkbox, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { usersApi } from "../features/user/authAPI";

// ...existing ApplicationUser interface...
export interface ApplicationUser {
    id: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    phoneNumber: string | null;
    phoneNumberConfirmed: boolean;
    lockoutEnabled: boolean;
    accessFailedCount: number;
}

const allColumnDefs = [
  { title: "ID", dataIndex: "id", key: "id", width: 100 },
  { title: "UserName", dataIndex: "userName", key: "userName", width: 100 },
  { title: "Email", dataIndex: "email", key: "email", width: 300 },
];

const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: 2,
            cursor: "ew-resize",
            zIndex: 2,
            userSelect: "none",
            background: "rgba(0,0,0,0.08)",
            transition: "background 0.2s",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "rgba(0,0,0,0.18)")}
          onMouseOut={e => (e.currentTarget.style.background = "rgba(0,0,0,0.08)")}
          onClick={e => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} style={{ position: "relative", ...restProps.style }} />
    </Resizable>
  );
};

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<ApplicationUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingUserName, setEditingUserName] = useState<string>("");

  // Track which columns are visible
  const [visibleKeys, setVisibleKeys] = useState<string[]>(allColumnDefs.map(col => col.key as string));
  const [columns, setColumns] = useState(allColumnDefs);

  useEffect(() => {
    setLoading(true);
    usersApi()
      .then((d) => {
        setUsers(d?.data || []);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  // Update columns when visibleKeys changes
  useEffect(() => {
    setColumns(
      allColumnDefs
        .filter(col => visibleKeys.includes(col.key as string))
        .map(col =>
          col.key === "userName"
            ? {
                ...col,
                render: (_: any, record: ApplicationUser) => {
                  if (editingKey === record.id) {
                    return (
                      <input
                        value={editingUserName}
                        onChange={e => setEditingUserName(e.target.value)}
                        onBlur={() => saveUserName(record.id)}
                        onKeyDown={e => {
                          if (e.key === "Enter") saveUserName(record.id);
                        }}
                        autoFocus
                        style={{ minWidth: 80 }}
                      />
                    );
                  }
                  return (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(record)}
                    >
                      {record.userName}
                    </span>
                  );
                },
              }
            : col
        )
    );
  }, [visibleKeys, editingKey, editingUserName]);

    const handleResize = (index: number) => (_: any, { size }: any) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
        };
        setColumns(nextColumns);
    };

  const resizeableColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  const handleEdit = (record: ApplicationUser) => {
    setEditingKey(record.id);
    setEditingUserName(record.userName);
  };

  const saveUserName = (id: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, userName: editingUserName } : user
      )
    );
    setEditingKey(null);
    setEditingUserName("");
    // Optionally, call an API to persist the change here
  };


const columnMenuItems = allColumnDefs.map(col => ({
  key: col.key,
  label: (
    <Checkbox
      checked={visibleKeys.includes(col.key as string)}
      onChange={e => {
        const checked = e.target.checked;
        setVisibleKeys(keys =>
          checked
            ? [...keys, col.key as string]
            : keys.filter(k => k !== col.key)
        );
      }}
      disabled={visibleKeys.length === 1 && visibleKeys.includes(col.key as string)}
      style={{ width: "100%", padding: "4px 12px" }}
    >
      {col.title}
    </Checkbox>
  ),
}));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
<Dropdown menu={{ items: columnMenuItems }} trigger={["click"]}>
  <Button>
    Columns <DownOutlined />
  </Button>
</Dropdown>
      </div>
      <h2>Users List</h2>
      <Table<ApplicationUser>
        bordered
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        dataSource={users}
              columns={resizeableColumns}
        rowKey="id"
        loading={loading}
              pagination={false}
          scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UsersList;