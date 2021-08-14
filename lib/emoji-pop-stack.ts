import * as cdk from '@aws-cdk/core';
import * as apigw2 from '@aws-cdk/aws-apigatewayv2';
import * as apigw2i from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";

export class EmojiPopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const counterLambda = new lambda.Function(this, "counterLambda", {
      handler: "emoji-rain-handler.handler2",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TEST: "test-env",
      }
    });

    const webSocketApi = new apigw2.WebSocketApi(this, 'mywsapi', {
      connectRouteOptions: { integration: new apigw2i.LambdaWebSocketIntegration({ handler: counterLambda }) },
      disconnectRouteOptions: { integration: new apigw2i.LambdaWebSocketIntegration({ handler: counterLambda }) },
      defaultRouteOptions: { integration: new apigw2i.LambdaWebSocketIntegration({ handler: counterLambda }) },
    });
    
    webSocketApi.addRoute('sendEmoji', {
      integration: new apigw2i.LambdaWebSocketIntegration({
        handler: counterLambda,
      }),
    });
    
    const webSocketStage = new apigw2.WebSocketStage(this, 'mystage', {
      webSocketApi,
      stageName: 'production',
      autoDeploy: true,
    });
    
    const webSocketURL = webSocketStage.url;
    // wss://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}
    const callbackURL = webSocketStage.callbackUrl;
    // https://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}

    counterLambda.addEnvironment("CALLBACK_URL", callbackURL);
    counterLambda.addEnvironment("WEB_SOCKET_URL", webSocketURL);
    
    // there must be a better way to do this!!.
    counterLambda.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonAPIGatewayInvokeFullAccess"))
    // addPermission to give resouce base policy-> pincliple is who will have the access.



    
    
  }
}
