import express from "express";
import { http, bucket } from "@nitric/sdk";

export const imgBucket = bucket("images").for("reading", "writing");

const app = express();

app.get("/upload/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const img = imgBucket.file(`images/${id}/photo.png`);

    res.json({
      url: await img.getUploadUrl(),
    });
  } catch (err) {
    res.statusCode = 500;
    res.json({
      message: "Error getting file URL",
    });
  }
});

http(app, () => {
  console.log(`Application started`);
});
