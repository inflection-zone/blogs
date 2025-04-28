import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Config } from "./interface";
import * as fs from 'fs';
import { createVpc } from "./vpc";
import { createSecurityGroup } from "./securitygroup";
import { getUserData } from "./script";
import { createIamRole } from "./iamroles";
import {createEc2Instance} from "./instance";
import {createDbSecurityGroup} from "./dbsecuritygroup";
import {createDbInstance} from "./dbinstance";
import {createWaf} from "./waf"

(async () => {

const config: Config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const instanceProfileName = `${config.projectName}-${config.environment}-ec2-instance-profile`

const { vpc, subnets } = await createVpc(config);

const securityGroup = await createSecurityGroup(config, vpc);

const dbSecurityGroup = await createDbSecurityGroup(config, vpc, securityGroup)

const dbServer = await createDbInstance(config, subnets, dbSecurityGroup)

const script = await getUserData();

const iamRole = await createIamRole(config);

const instanceProfile = new aws.iam.InstanceProfile(instanceProfileName, {
    name: instanceProfileName,
    role: iamRole.name,
});

const subnet = subnets[0]

const server = await createEc2Instance(subnet, script, instanceProfile, securityGroup, dbServer, config);

})()
