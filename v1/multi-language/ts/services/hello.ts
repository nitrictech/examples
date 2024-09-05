import * as nitric from "@nitric/sdk";

const api = nitric.api("main");
const helloTypescriptTopic = nitric.topic("hello-typescript");
const helloGolangTopic = nitric.topic("hello-golang").allow("publish");

api.get("/hello-golang", async (ctx) => {
  // Publish a message to the Golang topic
  await helloGolangTopic.publish({message: "Hello from Typescript"});

  ctx.res.body = "Saying hello to Golang from Typescript";
})

helloTypescriptTopic.subscribe(async () => {
  console.log("Received a message from Golang");
});
