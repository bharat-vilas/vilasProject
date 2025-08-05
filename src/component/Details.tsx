import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Table,
  Typography,
  Space,
  DatePicker,
  Col,
  Row,
  Select,
} from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { clients } from "../enums";

type ClientOption = DefaultOptionType & {
  firm?: string;
  address?: string;
  email?: string;
};

export default function Details({
  setClientInfo,
  clientInfo,
  setRecipientEmail,
  recipientEmail,
  setQuotationDate,
  quotationDate,
  handleAddItem,
  downloadPDF,
  handleCellChange,
  handleDeleteItem,
  items
}: any) {
    const columns = [
        {
          title: "S.No",
          render: (_: any, __: any, idx: number) => idx + 1,
        },
        {
          title: "Item",
          dataIndex: "item",
          render: (text: string, record: any) => (
            <Input
              value={text}
              onChange={(e) => handleCellChange(record.key, "item", e.target.value)}
              allowClear
            />
          ),
          width: "20vw"
        },
        {
          title: "Rate",
          dataIndex: "rate",
          render: (text: any, record: any) => (
            <Input
              // type="number"
              value={text}
              onChange={(e) => handleCellChange(record.key, "rate", e.target.value)}
              allowClear
            />
          ),
        },
        {
          title: "Qty",
          dataIndex: "qty",
          render: (text: any, record: any) => (
            <Input
              type="number"
              value={text}
              onChange={(e) => handleCellChange(record.key, "qty", e.target.value)}
            />
          ),
        },
        {
          title: "Amount",
          render: (_: any, record: any) => (
            <span>{(record.rate * record.qty).toFixed(2)}</span>
          ),
        },
        {
          title: "Action",
          render: (_: any, record: any) => (
            <Button danger onClick={() => handleDeleteItem(record.key)}>
              Delete
            </Button>
          ),
        },
      ];
  const totalAmount = items.reduce(
    (sum:any, item:any) => sum + item.rate * item.qty,
    0
  );
  return (
    <div
      style={{
        flex: 1,
        padding: 10,
        background: "#fff",
        borderRadius: "6px",
      }}
    >
      <div>
        <label style={{ fontWeight: "bold", fontSize: "15px" }}>Client</label>
        <Select
          style={{ width: "100%", marginBottom: "20px" }}
          placeholder="Select Client"
          options={clients}
          allowClear
          onChange={(value, option) => {
            const client = option as ClientOption;

            if (client) {
              setClientInfo((prev: any) => ({
                ...prev,
                name: client.value as string,
                firm: client.firm ?? "",
                address: client.address ?? "",
              }));
              setRecipientEmail(client.email ?? "");
            } else {
              setClientInfo({ name: "", firm: "", address: "" });
              setRecipientEmail("");
            }
          }}
        />
      </div>
      <Form layout="vertical">
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Client Name">
                <Input
                  placeholder="Enter name"
                  value={clientInfo.name}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, name: e.target.value })
                  }
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Firm Name">
                <Input
                  value={clientInfo.firm}
                  placeholder="Enter company"
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, firm: e.target.value })
                  }
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Recipient Email">
                <Input
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  allowClear
                  placeholder="Enter email"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={19}>
              <Form.Item label="Address">
                <Input
                  value={clientInfo.address}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, address: e.target.value })
                  }
                  allowClear
                  placeholder="Enter address"
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Quotation Date">
                <DatePicker
                  onChange={(date) => setQuotationDate(date)}
                  value={quotationDate}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>

          <Table
            dataSource={items}
            columns={columns}
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <b>Total</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <b>{totalAmount.toFixed(2)}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
              </Table.Summary.Row>
            )}
            rowKey="uniqueId"
            bordered
          />

          <Space style={{ marginTop: 20 }}>
            <Button type="primary" onClick={handleAddItem}>
              Add Item
            </Button>
            <Button type="primary" onClick={downloadPDF}>
              Download PDF
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
}
