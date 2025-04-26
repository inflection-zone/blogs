vpc_properties = {
    "vpc-name": "ecs-vpc",
    "vpc-igw-name": "ecs-vpc-igw",
    "vpc-public-rt-name": "ecs-vpc-public-rt",
    "vpc-private-rt-name": "ecs-vpc-private-rt",
    "vpc-public-subnet-name": "ecs-vpc-public-subnet",
    "vpc-private-subnet-name": "ecs-vpc-private-subnet"
}

s3_properties = {
    "s3-bucket-name": "",
    "s3-bucket-versioning": "",
    "s3-env-file-path" : ""
}

rds_properties = {
    "db-subnet-group-name": "ecs-db-subnet-group",
    "db-sg-name": "ecs-db-sg",
    "db-identifier": "ecs-db",
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
    "bastion-host-sg-name": "ecs-db-bastion-host-sg",
    "bastion-host-key-public-file": "",
    "bastion-host-instance-type": "t2.micro",
    "bastion-host-name": "ecs-db-bastion-host"
}

ecs_properties = {
    "ecs-cluster-name": "ecs-cluster",
    "ecs-task-execution-role-name": "ecs-task-execution-role",
    "ecs-task-family-name": "ecs-task-family",
    "ecs-container-name": "app-service",
    "ecs-container-image-name": "",
    "ecs-container-port": "",
    "s3-config-bucket": s3_properties["s3-bucket-name"],
    "s3-config-path": "",

    "ecs-service-name": "ecs-service",
    "ecs-service-desired-count": 1
}

ecs_container_definition = [
    {
        "name": ecs_properties["ecs-container-name"],
    	"image": ecs_properties["ecs-container-image-name"],
		"essential": True,
		"portMappings": [
            {
                "containerPort": ecs_properties["ecs-container-port"],
       			"hostPort": ecs_properties["ecs-container-port"],
				"protocol": "tcp"
			}
        ],
	    "environment": [
            {
				"name": "S3_CONFIG_BUCKET",
                "value": ecs_properties["s3-config-bucket"]
			},
            {
                "name": "S3_CONFIG_PATH",
                "value": ecs_properties["s3-config-path"]
	        }
        ]
	}
]

load_balancer_properties = {
    "load-balancer-sg-name": "ecs-lb-sg",
    "load-balancer-tg-name": "ecs-lb-tg",
    "port": ecs_properties["ecs-container-port"]
}
