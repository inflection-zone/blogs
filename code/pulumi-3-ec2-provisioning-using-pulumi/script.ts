import * as aws from "@pulumi/aws";
import { Config } from "./interface";
import * as pulumi from "@pulumi/pulumi";
import * as fs from 'fs';

export async function getUserData(): Promise<string> {

    const startScript = fs.readFileSync("start.sh", "utf-8");

    return `#!/bin/bash
    sudo apt-get update

    sudo apt-get install -y awscli

    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    sudo npm install -g pm2

    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    `;
}
