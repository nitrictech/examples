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
  <button
    onClick={async () => {
      try {
        const response = await fetch(`/api/forms/receipts/${submissionId}`);
        if (!response.ok) {
          throw new Error("Could not get receipt URL");
        }
        const { url } = await response.json();
        window.location.href = url; // behaves like a 303 redirect
      } catch (err) {
        console.error(err);
        alert("Failed to load receipt");
      }
    }}
  >
    View Receipt
  </button>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/forms/forms/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: { id: string } = await response.json();
      setSubmissionId(data.id);
      alert("Survey submitted successfully!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey.");
    }
  };

  return (
    <div>
      <h2>Survey</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rating (1–5):</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label>Feedback:</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {submissionId && (
        <div>
          <p>Submission ID: {submissionId}</p>
          <button
            onClick={async () => {
              try {
                const response = await fetch(
                  `/api/receipts/receipts/${submissionId}`
                );
                if (!response.ok) {
                  throw new Error("Could not get receipt URL");
                }
                const url = await response.text();
                window.location.href = url;
              } catch (err) {
                console.error(err);
                alert("Failed to load receipt");
              }
            }}
          >
            View Receipt
          </button>
        </div>
      )}
    </div>
  );
};

export default SurveyForm;
