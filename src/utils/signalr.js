// utils/signalr.js
import * as signalR from "@microsoft/signalr";
import { getAuthToken } from "./api";

let connection = null;

export const startConnection = async () => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7092/notificationHub", {
      accessTokenFactory: () => getAuthToken(), // ✅ attach JWT
       transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  try {
    await connection.start();
    console.log("✅ SignalR connected");
  } catch (err) {
    console.error("SignalR connection failed: ", err);
  }

  return connection;
};

export const getConnection = () => connection;
