import axios from "axios";
import { useState } from "react";

const AINoticeGenerator = () => {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  const generateNotice = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/generate-notice",
        { topic }
      );

      setResult(res.data.notice);
    } catch (err) {
      console.error(err);
      alert("AI failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>🤖 AI Notice Generator</h3>

      <input
        type="text"
        placeholder="Enter topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button onClick={generateNotice}>
        Generate Notice
      </button>

      <pre>{result}</pre>
    </div>
  );
};

export default AINoticeGenerator;