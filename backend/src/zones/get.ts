import { APIGatewayProxyHandler } from "aws-lambda";
import { initialZones, corsHeaders } from "./model.js";

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  const zone = initialZones.find((z) => z.id === id);

  if (!zone) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Zona no encontrada", requestedId: id })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(zone)
  };
};