# Function Title

Function description

## Setup Serverless Framework

Doshii's Lambda functions are built on the [serverless framework](https://serverless.com/framework/docs/).

All that is required for deployment and other AWS-side processing is the provisioning of an AWS key and secret under the profile name `serverless`.

First, you'll need to install the serverless package at version 1.10+

`yarn global add serverless`

Next use serverless to configure credentials

`serverless config credentials --provider aws --key <AWS_KEY> --secret <AWS_SECRET> --profile serverless`

`AWS_KEY` and `AWS_SECRET` need to be replaced with the keys from the AWS user `serverless-admin`. See Jimmy for the secret key or use a different IAM user.

## Setup This Function

Run `yarn run gen-credentials` to generate your local credentials into `.env/credentials.yml`.

The generated file and folder should not be checked into git (already set in the .gitignore).

## Deploying This Function

Preferred method for deployment is via Docker, although it can also be deployed from your local machine in a pinch.

1. You need to install Docker from [here](https://docs.docker.com/docker-for-mac/install/).

2. `docker pull lambci/lambda:build-nodejs6.10`

3. Run the deploy test environment via Docker container. `yarn run deploy:docker:test`. This will build the image, deploy then delete the created image.
