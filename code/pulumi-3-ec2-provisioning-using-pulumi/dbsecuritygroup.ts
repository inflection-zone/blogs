import * as aws from "@pulumi/aws";
import { Config } from "./interface";

export async function createDbSecurityGroup(
    config: Config,
    vpc: any,
    securityGroup: aws.ec2.SecurityGroup
): Promise<aws.ec2.SecurityGroup> {
    const securityGroupName = `${config.projectName}-${config.environment}-db-security-group`

    const dbSecurityGroup = new aws.ec2.SecurityGroup(securityGroupName, {
        description: "Allow requests from EC2 instance",
            vpcId: vpc.id,
            ingress: [{
                description: "Allow EC2 Access",
                fromPort: 3306,
                toPort: 3306,
                protocol: "tcp",
                securityGroups: [securityGroup.id],
            }],
            egress: [{
                fromPort: 0,
                toPort: 0,
                protocol: "-1",
                cidrBlocks: ["0.0.0.0/0"],
                ipv6CidrBlocks: ["::/0"],
            }],
            tags: {
                Name: "dev-db-sg",
            },
});
    return dbSecurityGroup;
}