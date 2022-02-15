// import {handler} from '../index';
import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { PostToConnectionRequest } from "aws-sdk/clients/apigatewaymanagementapi";
import {
  DeleteItemInput,
  PutItemInput,
  ScanInput,
} from "aws-sdk/clients/dynamodb";

beforeAll(() => {
  process.env.DYNAMODB_NAME = "DYNAMODB_NAME";
  process.env.CALLBACK_URL = "https://example.com";
  process.env.AUTO_DELETE_SEC = "2";
  process.env.AWS_REGION = "us-west-2";
});

describe("Success Cases", () => {
  it("Emojis' to be sent", async () => {
    // lambda event
    const event = {
      requestContext: {
        connectionId: "123",
        routeKey: "sendEmoji",
      },
      body: JSON.stringify({
        myEmoji: "😀",
      }),
    };
    const mockDynamoDB = [
      {
        connection: "123",
        ttl: 20,
      },
      {
        connection: "345",
        ttl: 20,
      },
      {
        connection: "9834",
        ttl: 20,
      },
    ];

    // inject AWS.
    AWSMock.setSDKInstance(AWS);

    // mock dynamoDB
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "scan",
      function (params: ScanInput, callback: Function) {
        callback(null, {
          Items: mockDynamoDB,
        });
      }
    );

    const connections = [];
    // mock connection
    AWSMock.mock(
      "ApiGatewayManagementApi",
      "postToConnection",
      function (params: PostToConnectionRequest, callback: Function) {
        // params.ConnectionId
        connections.push(params.ConnectionId);
        callback(null, {});
      }
    );

    // we imported down here so the environment variables can be injected
    const { handler } = await import("../index");
    const response = await handler(event, null, null);
    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!"),
      })
    );

    expect(connections).toEqual(["345", "9834"]);
  });

  it("Connection to be created", async () => {
    // lambda event
    const event = {
      requestContext: {
        connectionId: "123",
        routeKey: "$connect",
      },
    };
    const mockDynamoDB = [];

    // inject AWS.
    AWSMock.setSDKInstance(AWS);

    // mock dynamoDB
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "put",
      function (params: PutItemInput, callback: Function) {
        mockDynamoDB.push(params.Item);
        callback(null, "successfully put item in database");
      }
    );

    // we imported down here so the environment variables can be injected
    const { handler } = await import("../index");
    const response = await handler(event, null, null);
    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!"),
      })
    );
    expect(mockDynamoDB).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          connection: "123",
        }),
      ])
    );
  });

  it("Connection to be deleted", async () => {
    // lambda event
    const event = {
      requestContext: {
        connectionId: "123",
        routeKey: "$disconnect",
      },
    };
    const mockDynamoDB = [
      {
        connection: "123",
        ttl: 20,
      },
      {
        connection: "345",
        ttl: 20,
      },
    ];

    // inject AWS.
    AWSMock.setSDKInstance(AWS);

    // mock dynamoDB
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "delete",
      function (params: DeleteItemInput, callback: Function) {
        mockDynamoDB.splice(
          mockDynamoDB.findIndex((x) => x.connection == params.Key.connection),
          1
        );
        callback(null, "successfully delete item in database");
      }
    );

    // we imported down here so the environment variables can be injected
    const { handler } = await import("../index");
    const response = await handler(event, null, null);
    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!"),
      })
    );
    // should not contain deleted item
    expect(mockDynamoDB).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          connection: "123",
        }),
      ])
    );

    // should contain remaining item
    expect(mockDynamoDB).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          connection: "345",
        }),
      ])
    );
  });
});

describe("Failure Cases", () => {
  it("Connection to be deleted", async () => {
    // lambda event
    const event = {
      requestContext: {
        connectionId: "123",
        routeKey: "sendEmoji",
      },
      body: JSON.stringify({
        junkData: "💩",
      }),
    };

    // we imported down here so the environment variables can be injected
    const { handler } = await import("../index");
    const response = await handler(event, null, null);
    expect(response).toEqual(
      expect.objectContaining({
        statusCode: 400,
        body: expect.stringContaining("Invalid Emoji"),
      }),
    );
  });
})
