import { APIGatewayProxyHandler } from "aws-lambda";
import { ZoneInput, corsHeaders } from "./model.js";

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: "Falta body" }) };
  }
  const input: ZoneInput = JSON.parse(event.body);
  const newZone = { id: `ZONE-${Date.now().toString().slice(-2)}`, ...input };

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({ operation: "CREATED", item: newZone })
  };
};