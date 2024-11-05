import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  UpdateCommand,
  PutCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import crypto from "crypto";

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const fetchOrders = async () => {
    const command = new ScanCommand({
      ExpressionAttributeNames: { "#name": "name" },
      ProjectionExpression: "order_id, pno, #name, email,zipcode,address,shoe_name,qty,price",
      TableName: "Orders",
    });
  
    const response = await docClient.send(command);
  
    return response;
};


export const placeOrders = async ({pno,name,email,zipcode,address,shoe_name,qty,price}) => {
    const uuid=crypto.randomUUID()
    const command = new PutCommand({
        TableName:"Orders",
        Item:{
            order_id:uuid,
            pno,
            name,
            email,
            zipcode,
            address,
            shoe_name,
            qty,
            price
        }
    }

    )
    
  
    const response = await docClient.send(command);
  
    return response;
};

export const modifyOrders = async ({order_id,pno,name,email,zipcode,address,shoe_name,qty,price}) => {
    const command = new UpdateCommand({
        TableName:"Orders",
        Key:{
            order_id
        },
        ExpressionAttributeNames:{
            "#name":"name"
        },
        UpdateExpression: "set #name = :n, email = :e, pno = :p, address = :a",
        ExpressionAttributeValues:{
            ":n":name,
            ":e":email,
            ":p":pno,
            ":a":address
        },
        ReturnValues: "ALL_NEW"
    }
    )
  
    const response = await docClient.send(command);
  
    return response;
};

export const cancelOrders = async (order_id) => {
    const command = new DeleteCommand({
      TableName: "Orders",
      Key: {
        order_id,
      },
    });
  
    const response = await docClient.send(command);
  
    return response;
  };