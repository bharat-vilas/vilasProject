import { Card, Table, Typography } from "antd";
import React from "react";
import './componentCSS.css'

function Preview({ clientInfo, quotationDate, quotationRef, items }: any) {
  const previewColumns = [
    {
      title: "S.No",
      render: (_: any, __: any, idx: number) => idx + 1,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#DBDEE9",
          color: "black",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Item",
      dataIndex: "item",
      render: (text: string) => <span>{text}</span>,
      width: "25vw",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#DBDEE9",
          color: "black",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (text: string) => <span>{text}</span>,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#DBDEE9",
          color: "black",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      render: (text: string) => <span>{text}</span>,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#DBDEE9",
          color: "black",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Amount",
      render: (_: any, record: any) => (
        <span>{(record.rate * record.qty).toFixed(2)}</span>
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#DBDEE9",
          color: "black",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        },
      }),
    },
  ];
  const totalAmount = items.reduce(
    (sum: any, item: any) => sum + item.rate * item.qty,
    0
  );
  let currentSerial = parseInt(
    localStorage.getItem("quotationSerial") || "0"
  );
  return (
    <div className="quotation-section page-break" style={{ flex: 1, paddingLeft: 10, pageBreakBefore: 'always' }}>
      <Card title={`Quotation - #${(currentSerial+1).toString().padStart(4, "0")}`} ref={quotationRef}  style={{ paddingBottom: '40px' }} >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>GURUJI</div>
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>
              ENGINEERING
            </div>
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>WORKS</div>
          </div>
          <div>
            <img src="/GEWlogo2.png" alt="logo" style={{ height: "120px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Card style={{ flex: 1, background: "#DCFCE7" }}>
            {/* Left side content */}
            <div style={{ fontWeight: "bold" }}>FROM: </div>
            <div>Mr. Ram Vilas</div>
            <div>Guruji Engineering Works</div>
            <div>
              51, Ambedkar Market, Maharajpur, Sahibabad, Ghaziabad, UP(201010)
            </div>
          </Card>

          <Card style={{ flex: 1, background: "#DCFCE7" }}>
            {/* Right side content */}
            <div style={{ fontWeight: "bold" }}>TO: </div>
            <div>{clientInfo.name}</div>
            <div>{clientInfo.firm}</div>
            <div>{clientInfo.address}</div>
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "4px",
            marginBottom: "6px",
          }}
        >
          <div
            style={{ fontWeight: "bold", fontSize: "16px", margin: "10px 0px" }}
          >
            Date: {quotationDate ? quotationDate.format("DD/MM/YYYY") : ""}
          </div>
          <div
            style={{ fontWeight: "bold", fontSize: "16px", margin: "10px 0px" }}
          >
            GSTIN : 09ENCPM2429A1ZB
          </div>
        </div>

        <Table
          dataSource={items}
          columns={previewColumns}
          pagination={false}
          rowClassName={(record: any, index: number) =>
            index % 2 === 1 ? "#F3F4F6" : "white"
          }
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                <b>Total</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <b>{totalAmount.toFixed(2)}</b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
          bordered
        />
        <div
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          Instructions:
        </div>
        <div style={{ marginBottom: "15px" }}>
          <b>1. GST amount will be paid by you from the total amount</b> <br />
          2. If you accept this quote then send us the confirmation
        </div>
        <div
          style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" , alignContent: "center"}}
        >
          Thank you for your business.
        </div>
        <div>
          If you have any inquiries concerning this quote <br />
          please contact :{" "}
          <b>Mr. Ram Vilas 9990260536, Mr. Krishan Vilas 7838738789</b> <br />
          <b>ramv60074@gmail.com</b>
        </div>
        <div
          style={{ fontWeight: "bold", fontSize: "18px", marginTop: "10px", marginBottom: "8px" }}
        >
          Note:
        </div>
        <div style={{fontSize: "15px"}}>
          We also provide the following services: <br />
          All type of sheet fabrication work <br />
          Machinery Part <br />
          Gear <br />
          Machine Maintenance <br />
        </div>
      </Card>
    </div>
  );
}

export default Preview;
