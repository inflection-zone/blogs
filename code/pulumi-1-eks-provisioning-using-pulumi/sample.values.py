vpc_properties = {
    "vpc-name": "eks-vpc",
    "vpc-igw-name": "eks-vpc-igw",
    "vpc-public-rt-name": "eks-vpc-public-rt",
    "vpc-private-rt-name": "eks-vpc-private-rt",
    "vpc-public-subnet-name": "eks-vpc-public-subnet",
    "vpc-private-subnet-name": "eks-vpc-private-subnet"
}

rds_properties = {
    "db-subnet-group-name": "eks-db-subnet-group",
    "db-sg-name": "eks-db-sg",
    "db-identifier": "eks-db",
    "db-allocated-storage": 10,
    "db-engine": "mysql",
    "db-engine-version": "8.0",
    "db-instance-class": "db.t3.micro",
    "db-username": "",
    "db-password": "",
    "db-publicly-accessible": False,
    "db-skip-final-snapshot": True,
}

bastion_properties = {
    "bastion-host-sg-name": "eks-db-bastion-host-sg",
    "bastion-host-key-public-file": "",
    "bastion-host-instance-type": "t2.micro",
    "bastion-host-name": "eks-db-bastion-host"
}

eks_properties = {
    "eks-cluster-role-name": "eks-cluster-role",
    "eks-cluster-sg-name": "eks-cluster-sg",
    "eks-cluster-name": "eks-cluster",
    "eks-node-group-role-name": "eks-node-group-role",
    "eks-node-group-name": "eks-node-group",
    "eks-instance-types": ["t2.medium"]
}
