import { imgBucket } from "./resources";

export const getUrl = async (ctx) => {
  try {
    const { id } = ctx.req.params;

    const img = imgBucket.file(`images/${id}/photo.png`);
    const url = ctx.req.path.endsWith("upload")
      ? await img.getUploadUrl()
      : await img.getDownloadUrl();

    ctx.res.json({
      url: url,
    });
  } catch (err) {
    ctx.res.status = 500;
    ctx.res.message = "Error getting file URL";
  }
};
