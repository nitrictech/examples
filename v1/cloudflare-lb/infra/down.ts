// alias the nitric gateway
import { LocalWorkspace } from "@pulumi/pulumi/automation";
import { getNitricYaml } from "./config";

const run = async () => {
    // read the nitric.yaml file  
    const project = getNitricYaml();

    // get the current nitric stack
    const dnsStack = await LocalWorkspace.createOrSelectStack({
        projectName: `${project['name']}-dns`,
        stackName: `${project['name']}-dns-multicloud`,
        program: null, 
    });

    await dnsStack.destroy();
};

run().catch((err) => console.log(err));