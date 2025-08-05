import { useRef, useState } from "react";
import { Select, Tabs } from "antd";

import html2pdf from "html2pdf.js";

import dayjs from "dayjs"; // Import dayjs
import Details from "../../component/Details";
import Preview from "../../component/Preview";

const { TabPane } = Tabs;

const App = () => {
  const [clientInfo, setClientInfo] = useState({
    name: "",
    firm: "",
    address: "",
  });
  // const [clientsDDL, setClientsDDL] = useState(clients);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [items, setItems] = useState([{ key: 0, item: "", rate: 0, qty: 0 }]);
  const [quotationDate, setQuotationDate] = useState<dayjs.Dayjs | null>(); // State to hold the selected date as Dayjs
  const quotationRef = useRef<HTMLDivElement>(null);

  const handleAddItem = () => {
    const newItem = {
      key: Date.now(), // or use uuid() from uuid lib
      item: "",
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

  const downloadPDF = () => {
    // Get current serial number from localStorage (default to 0)
    let currentSerial = parseInt(
      localStorage.getItem("quotationSerial") || "0"
    );
    currentSerial++; // Increment
    localStorage.setItem("quotationSerial", currentSerial.toString()); // Save back

    // Format serial number with leading zeros (e.g., 001, 002)
    const formattedSerial = currentSerial.toString().padStart(4, "0");

    const opt = {
      // margin: 0.5,
      filename: `Quotation-${formattedSerial}.pdf`, // use serial in filename
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(opt).from(quotationRef.current).save();
  };

  return (
    <div
      style={{
        display: "flex",
        padding: 10,
        borderRadius: "8px",
        backgroundColor: "#ebf8ff",
        boxSizing: "border-box",
        flexDirection: "column",
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab={<strong>Quotation</strong>} key="1">
          <div
            style={{
              display: "flex",
              backgroundColor: "#ebf8ff",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              flex: 1,
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
              downloadPDF={downloadPDF}
              handleCellChange={handleCellChange}
              handleDeleteItem={handleDeleteItem}
              items={items}
            />
            <Preview
              clientInfo={clientInfo}
              quotationDate={quotationDate}
              quotationRef={quotationRef}
              items={items}
            />
          </div>
        </TabPane>

        <TabPane tab={<strong>Billing</strong>} key="2">
          <div style={{ display: "flex", flex: 1 }}>Billing content here</div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
