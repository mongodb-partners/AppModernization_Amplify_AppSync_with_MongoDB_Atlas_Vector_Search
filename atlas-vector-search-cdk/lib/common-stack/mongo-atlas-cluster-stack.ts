import * as fs from 'fs';
// This example creates a project and a cluster in Atlas using the L1 resources.
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnSearchIndex, CfnProject, CfnCluster, AdvancedRegionConfigProviderName, CfnDatabaseUser, CfnDatabaseUserProps } from 'awscdk-resources-mongodbatlas';

interface GlobalArgs {
  ATLAS_PUBLIC_KEY: string;
  ATLAS_PRIVATE_KEY: string;
  orgId: string;
  projectId: string;
  clusterName: string;
  region: string;
  profile: string;
  instanceSize: string;
  dataApi: string;
  PDFExtractInjestsEnv: Record<string, string>;
  QueryAndAnsEnv: Record<string, string>;
  VectorSearchEnv: Record<string, string>;
  ClassifyDataEnv: Record<string, string>;
  [key: string]: any;
}

interface CustomStackProps extends cdk.StackProps {
  globalArgs: GlobalArgs;
}

const dbDefaults = {
  profile: "default",
  dbName: "admin",
  username: "avs-cdk-user",
  password: "avs-cdk-pwd",
  roles: [
    {
      roleName: "readWriteAnyDatabase",
      databaseName: "admin",
    },
  ],
};

// ClusterStack class definition
export class ClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);

    const { globalArgs } = props;

    const clusterRes = new CfnCluster(this, 'ClusterResource', {
      name: globalArgs.clusterName,
      projectId: globalArgs.projectId,
      profile: globalArgs.profile,
      clusterType: globalArgs.clusterType,
      backupEnabled: true,
      pitEnabled: false,
      replicationSpecs: [{
        numShards: 1,
        advancedRegionConfigs: [{
          electableSpecs: {
            ebsVolumeType: "STANDARD",
            instanceSize: globalArgs.instanceSize,
            nodeCount: 3,
          },
          priority: 7,
          regionName: globalArgs.region,
        }]
      }]
    });

    // Create a new MongoDB Atlas Database User
    const mDBUser = new CfnDatabaseUser(this, "db-user", {
      profile: dbDefaults.profile,
      databaseName: dbDefaults.dbName,
      projectId: globalArgs.projectId,
      username: dbDefaults.username,
      roles: dbDefaults.roles,
      password: dbDefaults.password,
    });

    new cdk.CfnOutput(this, 'ClusterConnectionString', {
      value: clusterRes.connectionStrings.standardSrv || "No Conn String",
      description: 'Cluster Connection String',
      exportName: 'ClusterConnectionString'
    });

    new cdk.CfnOutput(this, 'dbUser', {
      value: dbDefaults.username,
      description: 'dbUser',
      exportName: 'dbUser'
    });

    new cdk.CfnOutput(this, 'dbPassword', {
      value: dbDefaults.password,
      description: 'dbPassword',
      exportName: 'dbPassword'
    });

  }
}



