import * as aws from "@pulumi/aws";
import { Config } from "./interface";
import * as pulumi from "@pulumi/pulumi";

export async function createDbInstance(config: Config, subnets: aws.ec2.Subnet[], dbSecurityGroup:aws.ec2.SecurityGroup) {

    const subnetGroupName = `${config.projectName}-${config.environment}-db-subnet-group`
    const dbInstanceName = `${config.projectName}-${config.environment}-db-server`

    const subnetGroup = new aws.rds.SubnetGroup(subnetGroupName, {
    subnetIds: [
        subnets[0].id,
        subnets[1].id,
    ],
    tags: {
        Name: subnetGroupName,
    },
    });

    const pulumiConfig = new pulumi.Config();
    const dbUsername = pulumiConfig.require("dbUsername");
    const dbPassword = pulumiConfig.require("dbPassword");

    const db = new aws.rds.Instance(dbInstanceName, {
            identifier: dbInstanceName,
            allocatedStorage: 10,
            dbName: "<your-db-name>",
            engine: "mysql",
            engineVersion: "8.0",
            instanceClass: "db.t3.micro",
            dbSubnetGroupName: subnetGroup.name,
            vpcSecurityGroupIds: [dbSecurityGroup.id],
            password: dbPassword,
            skipFinalSnapshot: true,
            username: dbUsername,
            publiclyAccessible: true
        });

    return db;
}