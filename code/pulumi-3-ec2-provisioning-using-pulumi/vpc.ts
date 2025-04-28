import * as aws from "@pulumi/aws";
import { Config } from "./interface";

export async function createVpc(config: Config) {

    const vpcName = `${config.projectName}-${config.environment}-vpc`;
    const igwName = `${config.projectName}-${config.environment}-internet-getway`;
    const publicSubnetName = `${config.projectName}-${config.environment}-public-subnet`;
    const privateSubnetName = `${config.projectName}-${config.environment}-private-subnet`;
    const publicRtName = `${config.projectName}-${config.environment}-public-route-table`;
    const privateRtName = `${config.projectName}-${config.environment}-private-route-table`;
    const publicRtAssociationName = `${config.projectName}-${config.environment}-public-route-tablet-association`;
    const privateRtAssociationName = `${config.projectName}-${config.environment}-private-route-table-association`;

    const vpc = new aws.ec2.Vpc(vpcName, {
        cidrBlock: "10.0.0.0/16",
        instanceTenancy: "default",
        tags: {
            Name: vpcName,
        },
    });

    const getway = new aws.ec2.InternetGateway(igwName, {
        vpcId: vpc.id,
        tags: {
            Name: igwName,
        },
    });

    const publicSubnet = new aws.ec2.Subnet(publicSubnetName, {
        vpcId: vpc.id,
        cidrBlock: "10.0.1.0/24",
        availabilityZone: "ap-south-1c",
        mapPublicIpOnLaunch: true,
        tags: {
            Name: publicSubnetName,
        },
    });

    const privateSubnet = new aws.ec2.Subnet(privateSubnetName, {
        vpcId: vpc.id,
        cidrBlock: "10.0.2.0/24",
        availabilityZone: "ap-south-1b",
        tags: {
            Name: privateSubnetName,
        },
    });

    const publicRt = new aws.ec2.RouteTable(publicRtName, {
        vpcId: vpc.id,
        routes: [
            {
                cidrBlock: "0.0.0.0/0",
                gatewayId: getway.id,
            },

        ],
        tags: {
            Name: publicRtName,
        },
    });

    const privateRt = new aws.ec2.RouteTable(privateRtName, {
        vpcId: vpc.id,
        routes: [
            {
                cidrBlock: "0.0.0.0/0",
                gatewayId: getway.id,
            }
        ],
        tags: {
            Name: privateRtName,
        },
    });

    const publicRtAssociation = new aws.ec2.RouteTableAssociation(publicRtAssociationName, {
        subnetId: publicSubnet.id,
        routeTableId: publicRt.id,
    });

    const privateRtAssociation = new aws.ec2.RouteTableAssociation(privateRtAssociationName, {
        subnetId: privateSubnet.id,
        routeTableId: privateRt.id,
    });

    return {
        vpc,
        subnets: [publicSubnet, privateSubnet],
        internetGateway: getway,
        routeTable: publicRt,
    };

}