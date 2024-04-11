import { topic, api, bucket, kv } from "@nitric/sdk";
import {
  RekognitionClient,
  DetectLabelsCommand,
} from "@aws-sdk/client-rekognition";

export const rekognition = new RekognitionClient({
  region: process.env.AWS_SES_REGION,
});

// KV Stores
export const products = kv("products").for("setting", "getting");

// API
export const inventoryApi = api("inventory");

// Topics
export const inventoryPub = topic("topic").for("publishing");

export const inventorySub = topic("topic");

// Buckets
export const bucketName = "images";
export const imageBucket = bucket(bucketName).for("reading", "writing");

export const recognize = async (name: string) => {
  const command = new DetectLabelsCommand({
    Image: {
      S3Object: {
        Bucket: process.env.BUCKETNAME,
        Name: name,
      },
    },
    MaxLabels: 10,
    MinConfidence: 50,
  });

  try {
    const response = await rekognition.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
