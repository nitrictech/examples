import React, { useState } from "react";

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    rating: 1,
    feedback: "",
  });
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/forms/forms/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit");

      const data: { id: string } = await response.json();
      setSubmissionId(data.id);
      alert("Survey submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit survey.");
    }
  };

  const fetchReceipt = async () => {
    try {
      const response = await fetch(`/api/receipts/receipts/${submissionId}`);
      if (!response.ok) throw new Error("Could not get receipt URL");
      const url = await response.text();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Failed to load receipt");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h2>Feedback Survey</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Rating (1–5):
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </label>

        <label>
          Feedback:
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      {submissionId && (
        <div style={{ marginTop: 20 }}>
          <p>
            Thank you! Your submission ID is <code>{submissionId}</code>
          </p>
          <button onClick={fetchReceipt}>View Receipt</button>
        </div>
      )}
    </div>
  );
};

export default SurveyForm;
