import { APIGatewayProxyHandler } from "aws-lambda";
import { corsHeaders } from "./model.js";

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ operation: "DELETED", id })
  };
};