# Prerequisites Installation

This guide will walk you through setting up your development environment for the "AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search" project on an Amazon Linux 2 EC2 instance. Follow these steps in order to install all necessary tools and dependencies.
- An EC2 instance running Amazon Linux 2.
- User with sudo privileges.

## Installation Steps

### Install Node.js and npm

We will use NVM (Node Version Manager) to install Node.js and npm because it allows you to easily switch between Node versions.

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install 21.7.1
```

### Install AWS CDK

```bash
npm install -g aws-cdk@2.135.0
```

### Install Git

```bash
sudo yum install git -y
```

### Clone the Project Repository

```bash
git clone "https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search.git"
cd AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search
```

### Configure AWS CLI

You will need to enter your AWS Access Key ID, Secret Access Key, region, and preferred output format during this step.

```bash
aws configure
```

### Install Project Dependencies

```bash
npm install
```

### Install Python3 and Pip

Python and Pip are required for various scripts and AWS operations.

```bash
sudo yum install python3-pip -y
```

### Install Expect

Expect is used for automating interactions that require user input.

```bash
sudo yum install expect -y
```

### Install AWS Amplify CLI

AWS Amplify CLI is used to manage and scale AWS cloud services used by your application.

```bash
npm i @aws-amplify/cli@12.11.0
```