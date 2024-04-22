import { getDomain } from "./getDomain";

export const getBrokerURL = () => {
  const domain = getDomain();
  const parsedUrl = new URL(domain);
  const host = parsedUrl.host;
  const wsScheme = domain.startsWith("https") ? "wss" : "ws";

  // return brokerURL for WebSocket
  // if local environment, returns "ws://localhost:8080/ws"
  // if app engine, returns "wss://xxxxxx/ws"
  return `${wsScheme}://${host}/ws`;
}