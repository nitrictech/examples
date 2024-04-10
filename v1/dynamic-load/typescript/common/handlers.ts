export const speak = async (ctx) => {
  const { animal } = ctx.req.params;
  try {
    // Dynamically load the module
    const handler = await require(`../animals/${animal}/greeting`);
    ctx.res.json({
      message: `${handler.sayHello()}`,
    });
  } catch (error) {
    ctx.res.json({
      message: `No module found for animal with name ${animal}`,
    });
    ctx.res.status = 501;
  }
};
