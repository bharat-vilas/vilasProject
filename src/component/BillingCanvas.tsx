import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Space,
  DatePicker,
  Col,
  Row,
  Select,
  message,
} from "antd";
import { MailOutlined, DownloadOutlined } from "@ant-design/icons";
import type { DefaultOptionType } from "antd/es/select";
import { clients } from "../enums";
import emailjs from "@emailjs/browser";
import { EMAIL_CONFIG } from "../config/emailConfig";
import { COMPANY_CONFIG } from "../config/companyConfig";

type ClientOption = DefaultOptionType & {
  firm?: string;
  address?: string;
  email?: string;
};

export default function BillingCanvas({
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
  supplyInfo,
  setSupplyInfo,
}: any) {
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
      billing_date: quotationDate ? quotationDate.format("DD/MM/YYYY") : "",
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
      },\n\nPlease find your billing details from Guruji Engineering Works.\n\nTotal Amount: ₹${totalAmount.toFixed(
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
            BILLING INVOICE
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

        {/* Supply Information */}
        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "2px solid #ffc107",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h4 style={{ color: "#856404", fontSize: "14px", margin: 0 }}>
              Supply Information
            </h4>
            <Button
              size="small"
              type={supplyInfo?.showInPreview ? "primary" : "default"}
              onClick={() =>
                setSupplyInfo((prev: any) => ({
                  ...prev,
                  showInPreview: !prev?.showInPreview,
                }))
              }
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                backgroundColor: supplyInfo?.showInPreview
                  ? "#52c41a"
                  : "#f5f5f5",
                borderColor: supplyInfo?.showInPreview ? "#52c41a" : "#d9d9d9",
              }}
            >
              {supplyInfo?.showInPreview
                ? "Hide in Preview"
                : "Show in Preview"}
            </Button>
          </div>
          <Row gutter={12}>
            <Col span={12}>
              <div style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "3px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    Date of Supply
                  </label>
                  <Button
                    size="small"
                    type={supplyInfo?.showDateOfSupply ? "primary" : "default"}
                    onClick={() =>
                      setSupplyInfo((prev: any) => ({
                        ...prev,
                        showDateOfSupply: !prev?.showDateOfSupply,
                      }))
                    }
                    style={{
                      fontSize: "10px",
                      padding: "1px 6px",
                      backgroundColor: supplyInfo?.showDateOfSupply
                        ? "#52c41a"
                        : "#f5f5f5",
                      borderColor: supplyInfo?.showDateOfSupply
                        ? "#52c41a"
                        : "#d9d9d9",
                    }}
                  >
                    {supplyInfo?.showDateOfSupply ? "Hide" : "Show"}
                  </Button>
                </div>
                <DatePicker
                  placeholder="Select supply date"
                  size="middle"
                  style={{ width: "100%" }}
                  onChange={(date) =>
                    setSupplyInfo((prev: any) => ({
                      ...prev,
                      dateOfSupply: date,
                    }))
                  }
                  value={supplyInfo?.dateOfSupply}
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "3px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    Place of Supply
                  </label>
                  <Button
                    size="small"
                    type={supplyInfo?.showPlaceOfSupply ? "primary" : "default"}
                    onClick={() =>
                      setSupplyInfo((prev: any) => ({
                        ...prev,
                        showPlaceOfSupply: !prev?.showPlaceOfSupply,
                      }))
                    }
                    style={{
                      fontSize: "10px",
                      padding: "1px 6px",
                      backgroundColor: supplyInfo?.showPlaceOfSupply
                        ? "#52c41a"
                        : "#f5f5f5",
                      borderColor: supplyInfo?.showPlaceOfSupply
                        ? "#52c41a"
                        : "#d9d9d9",
                    }}
                  >
                    {supplyInfo?.showPlaceOfSupply ? "Hide" : "Show"}
                  </Button>
                </div>
                <Input
                  placeholder="Enter place of supply"
                  size="middle"
                  style={{ fontSize: "14px" }}
                  value={supplyInfo?.placeOfSupply || ""}
                  onChange={(e) =>
                    setSupplyInfo((prev: any) => ({
                      ...prev,
                      placeOfSupply: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <div style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "3px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    Transportation Mode
                  </label>
                  <Button
                    size="small"
                    type={
                      supplyInfo?.showTransportationMode ? "primary" : "default"
                    }
                    onClick={() =>
                      setSupplyInfo((prev: any) => ({
                        ...prev,
                        showTransportationMode: !prev?.showTransportationMode,
                      }))
                    }
                    style={{
                      fontSize: "10px",
                      padding: "1px 6px",
                      backgroundColor: supplyInfo?.showTransportationMode
                        ? "#52c41a"
                        : "#f5f5f5",
                      borderColor: supplyInfo?.showTransportationMode
                        ? "#52c41a"
                        : "#d9d9d9",
                    }}
                  >
                    {supplyInfo?.showTransportationMode ? "Hide" : "Show"}
                  </Button>
                </div>
                <Input
                  placeholder="Enter transportation mode"
                  size="middle"
                  style={{ fontSize: "14px" }}
                  value={supplyInfo?.transportationMode || ""}
                  onChange={(e) =>
                    setSupplyInfo((prev: any) => ({
                      ...prev,
                      transportationMode: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "3px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    Vehicle Number
                  </label>
                  <Button
                    size="small"
                    type={supplyInfo?.showVehicleNumber ? "primary" : "default"}
                    onClick={() =>
                      setSupplyInfo((prev: any) => ({
                        ...prev,
                        showVehicleNumber: !prev?.showVehicleNumber,
                      }))
                    }
                    style={{
                      fontSize: "10px",
                      padding: "1px 6px",
                      backgroundColor: supplyInfo?.showVehicleNumber
                        ? "#52c41a"
                        : "#f5f5f5",
                      borderColor: supplyInfo?.showVehicleNumber
                        ? "#52c41a"
                        : "#d9d9d9",
                    }}
                  >
                    {supplyInfo?.showVehicleNumber ? "Hide" : "Show"}
                  </Button>
                </div>
                <Input
                  placeholder="Enter vehicle number"
                  size="middle"
                  style={{ fontSize: "14px" }}
                  value={supplyInfo?.vehicleNumber || ""}
                  onChange={(e) =>
                    setSupplyInfo((prev: any) => ({
                      ...prev,
                      vehicleNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Details of Receiver (Auto-filled from Client Selection) */}
        <div
          style={{
            backgroundColor: "#d1ecf1",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "2px solid #17a2b8",
          }}
        >
          <h4
            style={{ color: "#0c5460", marginBottom: "10px", fontSize: "14px" }}
          >
            Details of Receiver
          </h4>
          <Row gutter={12}>
            <Col span={12}>
              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "3px",
                    fontSize: "12px",
                  }}
                >
                  Receiver Name
                </label>
                <Input
                  placeholder="Auto-filled from client selection"
                  value={clientInfo.name}
                  size="middle"
                  style={{ fontSize: "14px", backgroundColor: "#f8f9fa" }}
                  readOnly
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "3px",
                    fontSize: "12px",
                  }}
                >
                  Receiver Company
                </label>
                <Input
                  placeholder="Auto-filled from client selection"
                  value={clientInfo.firm}
                  size="middle"
                  style={{ fontSize: "14px", backgroundColor: "#f8f9fa" }}
                  readOnly
                />
              </div>
            </Col>
          </Row>
          <div style={{ marginBottom: "8px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "3px",
                fontSize: "12px",
              }}
            >
              Receiver Address
            </label>
            <Input
              placeholder="Auto-filled from client selection"
              value={clientInfo.address}
              size="middle"
              style={{ fontSize: "14px", backgroundColor: "#f8f9fa" }}
              readOnly
            />
          </div>
        </div>

        {/* Invoice Date */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "2px solid #1890ff",
          }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "3px",
                    fontSize: "12px",
                  }}
                >
                  Email Address
                </label>
                <Input
                  placeholder="Enter email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  type="email"
                  size="middle"
                  style={{ fontSize: "14px" }}
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    marginBottom: "3px",
                    fontSize: "12px",
                  }}
                >
                  Invoice Date
                </label>
                <DatePicker
                  onChange={(date) => setQuotationDate(date)}
                  value={quotationDate}
                  size="middle"
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Items Section - Simplified for overlay */}
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
            Invoice Items (Total: ₹{totalAmount.toFixed(2)})
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
                placeholder="HSN Code"
                value={item.hsnCode || ""}
                onChange={(e) =>
                  handleCellChange(item.key, "hsnCode", e.target.value)
                }
                style={{ flex: 0.8 }}
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
