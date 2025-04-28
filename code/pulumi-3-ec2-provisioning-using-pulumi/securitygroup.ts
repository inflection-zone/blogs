import * as aws from "@pulumi/aws";
import { Config } from "./interface";

export async function createSecurityGroup(config:Config, vpc:any): Promise<aws.ec2.SecurityGroup> {
    const securityGroupName = `${config.projectName}-${config.environment}-security-group`

    const securityGroup = new aws.ec2.SecurityGroup(securityGroupName, {
    description: "EC2 Security Group",
    vpcId: vpc.id,
    ingress: [{
        description: "Allow HTTPS",
        fromPort: 443,
        toPort: 443,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    },
    {
        description: "Allow HTTP",
        fromPort: 80,
        toPort: 80,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    },
    {
        description: "Allow SSH",
        fromPort: 22,
        toPort: 22,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    },
    {
        description: "Allow requests at 5000",
        fromPort: 5000,
        toPort: 5000,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    },
    ],
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
        ipv6CidrBlocks: ["::/0"],
    }],
    tags: {
        Name: securityGroupName,
    },
});
    return securityGroup;
}