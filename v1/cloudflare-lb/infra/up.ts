// alias the nitric gateway
import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";
import { LocalWorkspace } from "@pulumi/pulumi/automation";
import { getNitricYaml, getNitricStacks } from "./config";

interface ApiOrigin {
  name: string;
  address: string;
}

const run = async () => {
  // read the nitric.yaml file
  const project = getNitricYaml();
  const { aws, gcp } = await getNitricStacks();

  const awsDeployment = await aws.exportStack();
  const gcpDeployment = await gcp.exportStack();

  // get deployed AWS apis
  const awsApis: ApiOrigin[] = awsDeployment.deployment.resources
    ?.filter(({ type }) => type === "aws:apigatewayv2/api:Api")
    .map(({ outputs }) => ({
      name: `aws-${outputs.name}`,
      address: outputs.apiEndpoint.replace("https://", ""),
      headers: [
        {
          header: "Host",
          values: [outputs.apiEndpoint.replace("https://", "")],
        },
      ],
    }));

  // get deployed GCP apis
  const gcpApis: ApiOrigin[] = gcpDeployment.deployment.resources
    ?.filter(({ type }) => type === "gcp:apigateway/gateway:Gateway")
    .map(({ outputs }) => ({
      name: `gcp-${outputs.labels["x-nitric-name"]}`,
      address: outputs.defaultHostname,
      headers: [
        {
          header: "Host",
          values: [outputs.defaultHostname],
        },
      ],
    }));

  const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const baseZone = process.env.DOMAIN;
  const subDomain = process.env.SUBDOMAIN;

  // Create a new load balancer that will route to each of these APIs
  const dnsStack = await LocalWorkspace.createOrSelectStack({
    projectName: `${project["name"]}-dns`,
    stackName: `${project["name"]}-dns-multicloud`,
    program: async () => {
      const pool = new cloudflare.LoadBalancerPool("gcplbpool", {
        accountId: cloudflareAccountId!,
        name: "all",
        origins: [...(awsApis || []), ...(gcpApis || [])],
      });

      // Get the configured zone
      const zone = await cloudflare.getZone({
        accountId: cloudflareAccountId!,
        name: baseZone!,
      });

      // just do random pool load balancing
      const exampleLoadBalancer = new cloudflare.LoadBalancer("multicloudlb", {
        zoneId: zone.zoneId,
        name: pulumi.interpolate`${subDomain}.${zone.name}`,
        fallbackPoolId: pool.id,
        defaultPoolIds: [pool.id],
        description:
          "multicloud load balancer steering between identical AWS and GCP deployments",
        proxied: true,
      });
    },
  });

  dnsStack.setConfig("cloudflare:apiToken", {
    secret: true,
    value: process.env.CLOUDFLARE_API_TOKEN as string,
  });

  const result = await dnsStack.up({
    onOutput: console.log,
  });

  console.log(`API available at: https://${subDomain}.${baseZone}`);
};

run().catch((err) => console.log(err));
