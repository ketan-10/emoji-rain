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