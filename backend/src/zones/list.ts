import { APIGatewayProxyHandler } from "aws-lambda";
import { initialZones, corsHeaders } from "./model.js";

export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(initialZones)
  };
};