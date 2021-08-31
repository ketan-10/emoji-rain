import * as cdk from '@aws-cdk/core';
import * as apigw2 from '@aws-cdk/aws-apigatewayv2';
import * as apigw2i from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as dynamodb from "@aws-cdk/aws-dynamodb";


export class EmojiPopStack extends cdk.Stack {

  // to get access in testing
  public readonly emojiRainHandler: lambda.Function;

  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/time-to-live-ttl-before-you-start.html
  static readonly AUTO_DELETE_SEC: number = 100;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const connectionsTable = new dynamodb.Table(this, "connectionsTable", {
      partitionKey: { name: 'connection', type: dynamodb.AttributeType.STRING },
      timeToLiveAttribute: 'ttl'
    });

    const emojiRainHandler = new lambda.Function(this, "emojiRainHandler", {
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      // code: lambda.Code.fromAsset('lambda'),
      code: lambda.Code.fromAsset('lambdas/emoji-rain-handler/dist/deploy.zip'),
      environment: {
        DYNAMODB_NAME: connectionsTable.tableName,
        AUTO_DELETE_SEC: EmojiPopStack.AUTO_DELETE_SEC.toString()
      }
    });

    const webSocketApi = new apigw2.WebSocketApi(this, 'emojiRainSocketAPI', {
      connectRouteOptions: { integration: new apigw2i.LambdaWebSocketIntegration({ handler: emojiRainHandler }) },
      disconnectRouteOptions: { integration: new apigw2i.LambdaWebSocketIntegration({ handler: emojiRainHandler }) },
      defaultRouteOptions: { integration: new apigw2i.LambdaWebSocketIntegration({ handler: emojiRainHandler }) },
    });
    
    webSocketApi.addRoute('sendEmoji', { integration: new apigw2i.LambdaWebSocketIntegration({ 
        handler: emojiRainHandler,
      }),
    });
    
    const webSocketStage = new apigw2.WebSocketStage(this, 'emojiRainSocketAPIStage', {
      webSocketApi,
      stageName: 'production',
      autoDeploy: true,
    });
    
    const webSocketURL = webSocketStage.url;
    // wss://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}
    const callbackURL = webSocketStage.callbackUrl;
    // https://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}

    emojiRainHandler.addEnvironment("CALLBACK_URL", callbackURL);
    // there must be a better way to do this!!.
    emojiRainHandler.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonAPIGatewayInvokeFullAccess"))
    // addPermission to give resouce base policy-> pincliple is who will have the access.
    connectionsTable.grantFullAccess(emojiRainHandler);
    
    new cdk.CfnOutput(this, 'WEB_SOCKET_URL', {
      value: webSocketURL,
    });

    this.emojiRainHandler = emojiRainHandler;


    
  }
}
