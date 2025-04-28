import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Config } from "./interface";

export async function createEc2Instance(subnet: aws.ec2.Subnet,
    userData: string,
    instanceProfile: aws.iam.InstanceProfile,
    securityGroup: aws.ec2.SecurityGroup,
    dbServer: aws.rds.Instance,
    config: Config): Promise<aws.ec2.Instance> {

    const serverName = `${config.projectName}-${config.environment}-server`

    const pulumiConfig = new pulumi.Config();

    let keyName: pulumi.Input<string> | undefined = pulumiConfig.get("keyName");
    const publicKey = pulumiConfig.get("publicKey");

    // The privateKey associated with the selected key must be provided (either directly or base64 encoded).
    const privateKey = pulumiConfig.requireSecret("privateKey").apply(key => {
        if (key.startsWith("-----BEGIN RSA PRIVATE KEY-----")) {
            return key;
        } else {
            return Buffer.from(key, "base64").toString("ascii");
        }
    });

    if (!keyName) {
        if (!publicKey) {
            throw new Error("must provide one of `keyName` or `publicKey`");
        }
        const key = new aws.ec2.KeyPair("key", { publicKey });
        keyName = key.keyName;
    }


    const ubuntu = aws.ec2.getAmi({
        mostRecent: true,
        filters: [
            {
                name: "name",
                values: ["ubuntu*-20.04-amd64-*"],
            },
            {
                name: "virtualization-type",
                values: ["hvm"],
            },
        ],
        owners: ["amazon"],
    });

    const server = new aws.ec2.Instance(serverName, {
        instanceType: "t3.small",
        vpcSecurityGroupIds: [ securityGroup.id ],
        ami: ubuntu.then(ubuntu => ubuntu.id),
        subnetId: subnet.id,
        keyName: keyName,
        iamInstanceProfile: instanceProfile.name,
        userData: userData,
        tags: {
                Name: serverName,
            },
    },
    // {dependsOn:[dbServer]}
);
    return server;
}