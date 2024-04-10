import {
  inventoryApi,
  products,
  imageBucket,
  inventoryPub,
  recognize,
} from "../common/resources";
import { v4 as uuid } from "uuid";

// Define our profile contents
interface Product {
  name: string;
  description: string;
  url: string;
  labels: string;
  rekognition: boolean;
}

// Create product with post method
inventoryApi.post("/products", async (ctx) => {
  let id = uuid();
  const product: Product = {
    name: ctx.req.json().name,
    description: ctx.req.json().description,
    url: "",
    labels: "",
    rekognition: false,
  };

  // Create the new product
  await products.set(id, product);

  // Notify
  const subject = `New product in inventory`;
  const template = `<!DOCTYPE html PUBLIC>
  <html lang="en">
      <title>Product added to inventory</title>
      </head>
      <body>
          {{ name }}<br>
          {{ description }}<br>
          {{ url }}
      </body>
  </html>`;

  await inventoryPub.publish({
    recipient: process.env.SYS_ADMIN_EMAIL,
    subject: subject,
    template: template,
    data: product,
  });

  // Return the id
  ctx.res.json({
    msg: `Product with id ${id} created.`,
  });
});

// Retrieve profile with get method
inventoryApi.get("/products/:id", async (ctx) => {
  const { id } = ctx.req.params;

  try {
    const image = imageBucket.file(`images/${id}/photo.png`);
    const product = await products.get(id);
    product.url = await image.getDownloadUrl();

    if (!product.rekognition) {
      const labels = await recognize(image.name);
      if (labels) {
        product.labels = labels;
        product.rekognition = true;
      }
    }
    return ctx.res.json(product);
  } catch (error) {
    ctx.res.status = 404;
    ctx.res.json({
      msg: `Product with id ${id} not found. ${error}`,
    });
  }
});

inventoryApi.get("/products/:id/image/upload", async (ctx) => {
  const { id } = ctx.req.params;

  // Return a signed url reference for upload
  const image = imageBucket.file(`images/${id}/photo.png`);
  const photoUrl = await image.getUploadUrl();

  // Invalidate labels, so they are recalculated
  const product = await products.get(id);
  product.rekognition = false;
  product.labels = "";

  ctx.res.json({
    url: photoUrl,
  });
});
