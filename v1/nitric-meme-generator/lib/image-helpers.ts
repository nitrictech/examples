export const imageHelpers = {
  base64ToBlob: (base64Data: string, type = "image/png"): Blob => {
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type });
  },

  generateImageFileName: (provider: string): string => {
    const uniqueId = Math.random().toString(36).substring(2, 8);
    return `${provider}-${uniqueId}`.replace(/[^a-z0-9-]/gi, "");
  },

  downloadImage: (imageBlob: Blob, provider: string): void => {
    const fileName = imageHelpers.generateImageFileName(provider);
    const blobUrl = URL.createObjectURL(imageBlob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  },

  formatModelId: (modelId: string): string => {
    return modelId.split("/").pop() || modelId;
  },
};

export const drawImageWithText = async (
  imageSrc: string,
  topText: string,
  bottomText: string
): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const img = new Image();
  img.src = imageSrc;

  // Wait for the image to load
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  // Set canvas dimensions to match the image
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0);

  // Set text styles
  ctx.font = "bold 48px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "center";

  // Draw top text
  if (topText) {
    ctx.strokeText(topText, canvas.width / 2, 60); // Outline
    ctx.fillText(topText, canvas.width / 2, 60); // Fill
  }

  // Draw bottom text
  if (bottomText) {
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 40); // Outline
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - 40); // Fill
  }

  // Convert canvas to Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create Blob from canvas");
      }
      resolve(blob);
    }, "image/png");
  });
};
