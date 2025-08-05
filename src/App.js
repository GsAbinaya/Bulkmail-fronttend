import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [status, setStatus] = useState("");

  

// ...

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFileName(file.name);

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const emails = json
      .flat()
      .map((val) => val && val.toString().trim())
      .filter((val) => val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); // ✅ Validate email format

    setEmails(emails);
  };

  reader.readAsArrayBuffer(file);
};


  const handleSend = async () => {
    try {
      const res = await axios.post("http://localhost:5000/sendemail", {
        msg: message,
        emailList: emails,
      });
      if (res.data.success) {
        setStatus("✅ Emails sent successfully!");
      }
    } catch (err) {
      setStatus("❌ Error sending emails.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📧 BulkMail</h2>
      <p style={styles.subtitle}>We can help your business with sending multiple emails at once</p>

      <textarea
        placeholder="Enter the email text..."
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={styles.textarea}
      />

      <div style={styles.fileBox}>
        <label style={styles.fileLabel}>
          <input type="file" accept=".txt,.csv,.xlsx" style={{ display: "none" }} onChange={handleFileChange} />
          Choose file
        </label>
        <span style={styles.fileName}>{fileName}</span>
      </div>

      <p>Total emails in the file: {emails.length}</p>

      <button onClick={handleSend} style={styles.button}>Send</button>

      <p style={styles.status}>{status}</p>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "light purple", // light green
    padding: 30,
    maxWidth: 600,
    margin: "30px auto",
    borderRadius: 10,
    fontFamily: "georgia",
    textAlign: "center",
  },
  title: {
    backgroundColor: "purple", // dark green
    color: "white",
    padding: "10px",
    borderRadius: "8px",
  },
  subtitle: {
    marginBottom: 20,
    color: "purple",
  },
  textarea: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    borderColor: "purple", // soft green border
    resize: "none",
  },
  fileBox: {
    marginTop: 20,
    marginBottom: 10,
  },
  fileLabel: {
    backgroundColor: "purple",
    padding: "8px 16px",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
    marginRight: 10,
  },
  fileName: {
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "purple",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
  status: {
    marginTop: 20,
    fontWeight: "bold",
  },
};

export default App;
