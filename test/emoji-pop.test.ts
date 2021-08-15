import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EmojiPop from '../lib/emoji-pop-stack';

test('should contain mandatory resource', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EmojiPop.EmojiPopStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
    expectCDK(stack).to(haveResource("AWS::ApiGatewayV2::Api"));

    expectCDK(stack).to(haveResource("AWS::Lambda::Function"));

});


test('should exist Funtion', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new EmojiPop.EmojiPopStack(app, 'MyTestStack');
  // THEN only token will exist
  expect(stack.emojiRainHandler.functionName).not.toBeNull(); 
});
