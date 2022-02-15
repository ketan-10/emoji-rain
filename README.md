## [Live Site](https://youtu.be/-wMsctEBC0w)
![Gh-pages](https://github.com/ketan-10/emoji-rain/actions/workflows/deploy.web.yaml/badge.svg)
![AWS Deployement](https://github.com/ketan-10/emoji-rain/actions/workflows/deploy.aws.yaml/badge.svg)
[![codecov](https://codecov.io/gh/ketan-10/emoji-rain/branch/server/graph/badge.svg)](https://codecov.io/gh/ketan-10/emoji-rain)
# AWS CDK Infrasturcture as a code 
## For Fontend code please check [`master`](https://github.com/ketan-10/emoji-rain) branch
## [Youtube Lecture](https://youtu.be/-wMsctEBC0w)


![ezgif com-gif-maker](https://user-images.githubusercontent.com/35309821/129491883-bdece1cb-be6c-4b8a-86b0-67fc0c3a9a02.gif)

## Architecture:
![image](https://user-images.githubusercontent.com/35309821/153754461-b96ce281-482a-4b92-8677-cdc3ce77644e.png)

## Setup

`git clone https://github.com/ketan-10/emoji-rain.git`

`cd emoji-rain`

`yarn` : Install dependencies

`yarn dev` : Serve application


**Dependencies Used :**

- @material-ui/core : styling
- react-spring : animation 


# References

### Videos

- [Vite App](https://www.youtube.com/watch?v=9zySeP5vH9c&ab_channel=JasonLengstorf)

- [How to Deploy Your Vite App to Github Pages](https://www.youtube.com/watch?v=yo2bMGnIKE8&ab_channel=LearnVue)

- [How to build a chat using Lambda + WebSocket + API Gateway?](https://www.youtube.com/watch?v=BcWD-M2PJ-8&ab_channel=BiteSizeAcademy)

- [How to deploy a lambda function using github actions? (Typescript)](https://www.youtube.com/watch?v=UQiRhKgQ5X0&ab_channel=BiteSizeAcademy)

- [Deploying AWS CDK With Github Actions](https://www.youtube.com/watch?v=KCp6BmUGBHc&ab_channel=MichaelLevan)

- [Setting Up Github Actions for a React App on Github Pages](https://www.youtube.com/watch?v=N63C0mkFDFw&ab_channel=Keith%2CtheCoder)

### Database
- Future migration to MySQL [How to connect AWS Lambda to a MySQL database to update it? (using RDS proxy)](https://youtu.be/jOLgUjcTFEI) 

- MySQS DeadLock and Indexing [Blocking and Locking: How to Find and Fight Concurrency Problems](https://youtu.be/EqfAPZGKifA)

### Documentation

- [CDK Workshop](https://cdkworkshop.com/)

- [Github actions share workspace/artifacts between jobs?](https://stackoverflow.com/questions/57498605/github-actions-share-workspace-artifacts-between-jobs)

- [Triggering a new workflow from another workflow](https://stackoverflow.com/questions/60418323/triggering-a-new-workflow-from-another-workflow)

- [AWS CDK ApiGateway WebSoccket Docs](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-apigatewayv2-readme.html#websocket-api)

- [How to use Outputs in AWS CDK & CDK Tokens](https://bobbyhadz.com/blog/aws-cdk-outputs)

#### Distributed Applications

- [Choosing the Right Messaging Service for Your Distributed App](https://youtu.be/4-JmX6MIDDI)

- [The CAP Theorem](https://youtu.be/k-Yaq8AHlFA) 

#### Lambda failuer handling

- [Failure Handling Using a Lambda DLQ (Dead Letter Queue)](https://youtu.be/nqQh2KmHiLY)

- [SNS to Lambda vs SNS to SQS to Lambda](https://stackoverflow.com/questions/42656485/sns-to-lambda-vs-sns-to-sqs-to-lambda)



# Welcome to your CDK TypeScript project!

`npm install -g aws-cdk`

`cdk init app --language=typescript`

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk bootstrap`   The first time you deploy an AWS CDK app into an environment (account/region), you can install a “bootstrap stack”. This stack includes resources that are used in the toolkit’s operation. For example, the stack includes an S3 bucket that is used to store templates and assets during the deployment process.


## Creating Typescript Lambda
 * `mkdir lambdas/emoji-rain-handler`   create new directory for lambda
 * `npm init`                           new npm project with all defaults
 * `touch index.ts`                     create new index.ts file
 * `npm i --save typescript`            install typescript
 * `touch tsconfig.json`                create empty tsconfig.json file
 * `npm i --save-dev @types/node @types/aws-lambda`       install types
 * `npm i --save-dev @vercel/ncc`       ncc compiler to compile typescript and bundle
 * Copy tsconfig.json from readme of github.com/vercel/ncc
 * `npm install aws-sdk && npm i --save-dev @types/aws-sdk`
 * `npx ncc build index.ts -o dist/ncc`             build lambda 
 * `zip -j dist/deploy.zip ./dist/ncc/*`           build zip
 * `cdk deploy --outputs-file ./cdk-outputs.json`  cdk output file
