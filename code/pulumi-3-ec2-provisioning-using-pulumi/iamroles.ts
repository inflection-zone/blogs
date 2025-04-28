import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Config } from "./interface";

export async function createIamRole(config: Config): Promise<aws.iam.Role> {

    const roleName = `${config.projectName}-${config.environment}-ec2-instance-role`;

    const role = new aws.iam.Role(roleName, {
        assumeRolePolicy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "ec2.amazonaws.com",
                },
                Effect: "Allow",
                Sid: "",
            }],
        }),
    });

    // // Attach policy to the role

    const policy = new aws.iam.Policy("rds-readOnly-policy", {
            policy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow",
                    Action: [
                        "rds:Describe*",
                        "rds:ListTagsForResource",
                        "ec2:DescribeAccountAttributes",
                        "ec2:DescribeAvailabilityZones",
                        "ec2:DescribeInternetGateways",
                        "ec2:DescribeSecurityGroups",
                        "ec2:DescribeSubnets",
                        "ec2:DescribeVpcAttribute",
                        "ec2:DescribeVpcs",
                    ],
                    Resource: "*",
                }],
            }),
        });

        new aws.iam.RolePolicyAttachment("rds-readOnly-policy-attachment", {
            policyArn: policy.arn,
            role: role.name,
        });

    return role;
}