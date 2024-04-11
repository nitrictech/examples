export const handlePing = async (ctx) => {
  const { url } = ctx.req.json();
  const formattedUrl =
    url.startsWith("http:") || url.startsWith("https:")
      ? url
      : `https://${url}`;

  try {
    const response = await fetch(formattedUrl);
    ctx.res.body = { status: response.status < 400, url: formattedUrl };
  } catch (error) {
    ctx.res.body = { status: false, url: formattedUrl };
  }
};
