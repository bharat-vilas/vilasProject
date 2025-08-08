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
  message,
} from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { clients } from "../enums";
import { MailOutlined, DownloadOutlined } from "@ant-design/icons";
import emailjs from "@emailjs/browser";
import { EMAIL_CONFIG } from "../config/emailConfig";
import { COMPANY_CONFIG } from "../config/companyConfig";

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
  items,
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
      width: "20vw",
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
    (sum: any, item: any) => sum + item.rate * item.qty,
    0
  );

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      message.error("Please enter recipient email address");
      return;
    }

    const { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } = EMAIL_CONFIG;

    const templateParams = {
      to_email: recipientEmail,
      client_name: clientInfo.name,
      client_firm: clientInfo.firm,
      quotation_date: quotationDate ? quotationDate.format("DD/MM/YYYY") : "",
      items: items
        .map(
          (item: any, index: number) =>
            `${index + 1}. ${item.item} - Qty: ${item.qty}, Rate: ₹${
              item.rate
            }, Amount: ₹${(item.rate * item.qty).toFixed(2)}`
        )
        .join("\n"),
      total_amount: totalAmount.toFixed(2),
      from_name: "Guruji Engineering Works",
      message: `Dear ${
        clientInfo.name
      },\n\nPlease find your quotation details from Guruji Engineering Works.\n\nTotal Amount: ₹${totalAmount.toFixed(
        2
      )}\n\nThank you for your business.`,
    };

    try {
      message.loading({ content: "Sending email...", key: "sendEmail" });

      if (
        SERVICE_ID === "your_service_id" ||
        TEMPLATE_ID === "your_template_id" ||
        PUBLIC_KEY === "your_public_key"
      ) {
        message.warning({
          content:
            "Please configure EmailJS credentials in src/config/emailConfig.ts",
          key: "sendEmail",
          duration: 4,
        });
        return;
      }

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      message.success({
        content: "Email sent successfully!",
        key: "sendEmail",
        duration: 2,
      });
    } catch (error) {
      message.error({
        content: "Failed to send email. Please try again.",
        key: "sendEmail",
      });
      console.error("Email sending error:", error);
    }
  };
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        minHeight: "600px",
        overflowY: "auto",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ color: "#1890ff", margin: 0, textAlign: "center" }}>
            QUOTATION FORM
          </h2>
        </div>

        {/* Client Selection */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{ fontWeight: "bold", fontSize: "15px", color: "#333" }}
          >
            Select Client
          </label>
          <Select
            style={{ width: "100%", marginTop: "8px" }}
            placeholder="Choose a client"
            options={clients}
            allowClear
            size="large"
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

        {/* Client Information */}
        <div
          style={{
            backgroundColor: "#d1ecf1",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "2px solid #17a2b8",
          }}
        >
          <h4 style={{ color: "#0c5460", marginBottom: "15px" }}>
            Client Information
          </h4>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Client Name
                </label>
                <Input
                  placeholder="Enter client name"
                  value={clientInfo.name}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, name: e.target.value })
                  }
                  size="large"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Company/Firm
                </label>
                <Input
                  placeholder="Enter company name"
                  value={clientInfo.firm}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, firm: e.target.value })
                  }
                  size="large"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Email Address
                </label>
                <Input
                  placeholder="Enter email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  type="email"
                  size="large"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Quotation Date
                </label>
                <DatePicker
                  onChange={(date) => setQuotationDate(date)}
                  value={quotationDate}
                  size="large"
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
          </Row>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Address
            </label>
            <Input
              placeholder="Enter complete address"
              value={clientInfo.address}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, address: e.target.value })
              }
              size="large"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Items Section */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "2px solid #52c41a",
          }}
        >
          <h4 style={{ color: "#52c41a", marginBottom: "15px" }}>
            Quotation Items (Total: ₹{totalAmount.toFixed(2)})
          </h4>

          {items.map((item: any, index: number) => (
            <div
              key={item.key}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "rgba(240, 248, 255, 0.8)",
                borderRadius: "4px",
              }}
            >
              <span style={{ minWidth: "30px", fontWeight: "bold" }}>
                {index + 1}.
              </span>
              <Input
                placeholder="Item description"
                value={item.item}
                onChange={(e) =>
                  handleCellChange(item.key, "item", e.target.value)
                }
                style={{ flex: 3 }}
              />
              <Input
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleCellChange(item.key, "rate", e.target.value)
                }
                prefix="₹"
                style={{ flex: 1 }}
              />
              <Input
                placeholder="Qty"
                type="number"
                value={item.qty}
                onChange={(e) =>
                  handleCellChange(item.key, "qty", e.target.value)
                }
                style={{ flex: 1 }}
              />
              <span
                style={{
                  minWidth: "80px",
                  fontWeight: "bold",
                  color: "#1890ff",
                }}
              >
                ₹{(item.rate * item.qty).toFixed(2)}
              </span>
              <Button
                danger
                size="small"
                onClick={() => handleDeleteItem(item.key)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: "center" }}>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              onClick={handleAddItem}
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Add Item
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<MailOutlined />}
              onClick={handleSendEmail}
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            >
              Send Email
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              onClick={downloadPDF}
              style={{ backgroundColor: "#722ed1", borderColor: "#722ed1" }}
            >
              Download PDF
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
