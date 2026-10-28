import { APIGatewayProxyHandler } from "aws-lambda";
import { corsHeaders } from "./model.js";

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  if (!event.body) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: "Falta body" }) };
  }
  const { status } = JSON.parse(event.body);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ operation: "UPDATED", id, changes: { status } })
  };
};