/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table, Checkbox, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

// Define the Unit interface
export interface Unit {
  id: string;
  name: string;
  type: string;
  status: string;
}

// Mock API for live units (replace with real API call)
const unitsApi = async (): Promise<{ data: Unit[] }> => {
  // Simulate API delay and return some live units
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          data: [
            { id: "1", name: "Unit Alpha", type: "Sensor", status: "Live" },
            { id: "2", name: "Unit Beta", type: "Camera", status: "Live" },
            { id: "3", name: "Unit Gamma", type: "Sensor", status: "Live" }
          ]
        }),
      500
    )
  );
};

const allColumnDefs = [
  { title: "ID", dataIndex: "id", key: "id", width: 100 },
  { title: "Name", dataIndex: "name", key: "name", width: 150 },
  { title: "Type", dataIndex: "type", key: "type", width: 120 },
  { title: "Status", dataIndex: "status", key: "status", width: 120 }
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

const UnitList: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Track which columns are visible
  const [visibleKeys, setVisibleKeys] = useState<string[]>(allColumnDefs.map(col => col.key as string));
  const [columns, setColumns] = useState(allColumnDefs);

  useEffect(() => {
    setLoading(true);
    unitsApi()
      .then((d) => {
        setUnits(d?.data || []);
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
      allColumnDefs.filter(col => visibleKeys.includes(col.key as string))
    );
  }, [visibleKeys]);

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
      <h2>Units List</h2>
      <Table<Unit>
        bordered
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        dataSource={units}
        columns={resizeableColumns}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UnitList;