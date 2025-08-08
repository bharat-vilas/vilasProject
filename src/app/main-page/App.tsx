import { useRef, useState } from "react";
import { Select, Tabs, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

import html2pdf from "html2pdf.js";

import dayjs from "dayjs"; // Import dayjs
import Details from "../../component/Details";
import Preview from "../../component/Preview";
import BillingCanvas from "../../component/BillingCanvas";
import BillingPreview from "../../component/BillingPreview";
import "./App.css";

const { TabPane } = Tabs;

const App = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    message.success("Logged out successfully!");
    navigate("/login");
  };

  const [clientInfo, setClientInfo] = useState({
    name: "",
    firm: "",
    address: "",
  });
  // const [clientsDDL, setClientsDDL] = useState(clients);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [items, setItems] = useState([
    { key: 0, item: "", hsnCode: "", rate: 0, qty: 0 },
  ]);
  const [supplyInfo, setSupplyInfo] = useState({
    dateOfSupply: null,
    placeOfSupply: "",
    transportationMode: "",
    vehicleNumber: "",
    showInPreview: true,
    showDateOfSupply: true,
    showPlaceOfSupply: true,
    showTransportationMode: true,
    showVehicleNumber: true,
  });
  const [quotationDate, setQuotationDate] = useState<dayjs.Dayjs | null>(); // State to hold the selected date as Dayjs
  const [quotationSerial, setQuotationSerial] = useState(() =>
    parseInt(localStorage.getItem("quotationSerial") || "0")
  );
  const [billingSerial, setBillingSerial] = useState(() =>
    parseInt(localStorage.getItem("billingSerial") || "0")
  );
  const quotationRef = useRef<HTMLDivElement>(null);
  const billingRef = useRef<HTMLDivElement>(null);

  const handleAddItem = () => {
    const newItem = {
      key: Date.now(), // or use uuid() from uuid lib
      item: "",
      hsnCode: "",
      rate: 0,
      qty: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (key: any) => {
    setItems(items.filter((item) => item.key !== key));
  };

  const handleCellChange = (key: any, field: any, value: any) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      )
    );
  };

  const downloadQuotationPDF = () => {
    // Capture the current number that's shown in preview
    const currentSerialForPDF = quotationSerial;

    // Format serial number with leading zeros (e.g., 001, 002)
    const formattedSerial = currentSerialForPDF.toString().padStart(4, "0");

    const opt = {
      // margin: 0.5,
      filename: `Quotation-${formattedSerial}.pdf`, // use serial in filename
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    // Download the PDF with the current number (same as shown in preview)
    html2pdf()
      .set(opt)
      .from(quotationRef.current)
      .save()
      .then(() => {
        // Only increment after PDF is successfully generated
        const newSerial = quotationSerial + 1;
        setQuotationSerial(newSerial);
        localStorage.setItem("quotationSerial", newSerial.toString());
      });
  };

  const downloadBillingPDF = () => {
    // Capture the current number that's shown in preview
    const currentSerialForPDF = billingSerial;

    // Format serial number with leading zeros (e.g., 001, 002)
    const formattedSerial = currentSerialForPDF.toString().padStart(4, "0");

    const opt = {
      // margin: 0.5,
      filename: `Invoice-${formattedSerial}.pdf`, // use serial in filename
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    // Download the PDF with the current number (same as shown in preview)
    html2pdf()
      .set(opt)
      .from(billingRef.current)
      .save()
      .then(() => {
        // Only increment after PDF is successfully generated
        const newSerial = billingSerial + 1;
        setBillingSerial(newSerial);
        localStorage.setItem("billingSerial", newSerial.toString());
      });
  };

  return (
    <div
      style={{
        display: "flex",
        padding: 0,
        borderRadius: "0px",
        backgroundColor: "#f8fafc",
        boxSizing: "border-box",
        flexDirection: "column",
        minHeight: "100vh",
        boxShadow: "none",
        position: "relative",
      }}
    >
      {/* Logout Button */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <Button
          type="primary"
          danger
          onClick={handleLogout}
          style={{
            backgroundColor: "#ff4d4f",
            borderColor: "#ff4d4f",
          }}
        >
          Logout
        </Button>
      </div>
      <Tabs
        defaultActiveKey="1"
        className="custom-tabs"
        style={{
          width: "100%",
        }}
        tabBarStyle={{
          marginBottom: 0,
          background: "#ffffff",
          borderRadius: "0px",
          padding: "0px",
          boxShadow: "none",
        }}
        tabBarGutter={0}
        type="card"
        size="large"
        animated={{ tabPane: true }}
      >
        <TabPane
          tab={
            <div
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.3s ease",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              📋 Quotation
            </div>
          }
          key="1"
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#f0f9f0",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              flex: 1,
              borderRadius: "0px",
              padding: "0px",
              gap: "0px",
            }}
          >
            <Details
              setClientInfo={setClientInfo}
              clientInfo={clientInfo}
              setRecipientEmail={setRecipientEmail}
              recipientEmail={recipientEmail}
              setQuotationDate={setQuotationDate}
              quotationDate={quotationDate}
              handleAddItem={handleAddItem}
              downloadPDF={downloadQuotationPDF}
              handleCellChange={handleCellChange}
              handleDeleteItem={handleDeleteItem}
              items={items}
            />
            <Preview
              clientInfo={clientInfo}
              quotationDate={quotationDate}
              quotationRef={quotationRef}
              items={items}
              quotationSerial={quotationSerial}
            />
          </div>
        </TabPane>

        <TabPane
          tab={
            <div
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.3s ease",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              💰 Billing
            </div>
          }
          key="2"
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#f8f0ff",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              flex: 1,
              borderRadius: "0px",
              padding: "0px",
              gap: "0px",
            }}
          >
            <BillingCanvas
              setClientInfo={setClientInfo}
              clientInfo={clientInfo}
              setRecipientEmail={setRecipientEmail}
              recipientEmail={recipientEmail}
              setQuotationDate={setQuotationDate}
              quotationDate={quotationDate}
              handleAddItem={handleAddItem}
              downloadPDF={downloadBillingPDF}
              handleCellChange={handleCellChange}
              handleDeleteItem={handleDeleteItem}
              items={items}
              supplyInfo={supplyInfo}
              setSupplyInfo={setSupplyInfo}
            />
            <BillingPreview
              clientInfo={clientInfo}
              quotationDate={quotationDate}
              quotationRef={billingRef}
              items={items}
              supplyInfo={supplyInfo}
              billingSerial={billingSerial}
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
