import { useState, useEffect, useCallback, useRef } from "react";
import {
  WebSocketMessage,
  MetricsUpdates,
  ConnectionStatus,
} from "../types/websocket";

interface UseRealTimeDataOptions {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage: (message: WebSocketMessage) => void;
  onError: (error: Error) => void;
}

interface UseRealTimeDataReturn {
  //Connection Status
  status: ConnectionStatus;
  isConnected: boolean;

  //Latest Data
  latestMessage: WebSocketMessage | null;
  metrics: MetricsUpdates["data"] | null;

  //Connection Control
  connect: () => void;
  disconnect: () => void;

  //message history (last 50 messages)
  messageHistory: WebSocketMessage[];
}

export function useRealTimeData({
  url,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
  onMessage,
  onError,
}: UseRealTimeDataOptions): UseRealTimeDataReturn {
  //status management
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [latestMessage, setLatestMessage] = useState<WebSocketMessage | null>(
    null
  );
  const [metrics, setMetrics] = useState<MetricsUpdates["data"] | null>(null);
  const [messageHistory, setMessageHistory] = useState<WebSocketMessage[]>([]);

  //refs for cleanup
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);

  //message handler
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        //update latest message
        setLatestMessage(message);

        //update message history
        setMessageHistory((prev) => [message, ...prev].slice(0, 50));

        //update metrics message
        if (message.type === "METRICS_UPDATE") {
          setMetrics(message.data);
        }

        //call the onMessage callback
        onMessage?.(message);
      } catch (error) {
        onError?.(error as Error);
      }
    },
    [onMessage, onError]
  );

  //Connection Logic
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus("connecting");

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setStatus("connected");
        reconnectCountRef.current = 0;
        console.log("Connected to WebSocket");
      };
      ws.onmessage = handleMessage;

      ws.onerror = (error) => {
        if (!mountedRef.current) return;
        setStatus("error");
        console.error("WebSocket Error:", error);
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        setStatus("disconnected");
        console.log("WebSocket Disconnected", event.code, event.reason);

        //reconnect logic
        if (reconnectCountRef.current < reconnectAttempts && !event.wasClean) {
          reconnectCountRef.current++;
          console.log(
            `Attempting to reconnect (${reconnectCountRef.current}/${reconnectAttempts}) in ${reconnectInterval}ms`
          );
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            connect();
          }
        }, reconnectInterval);
      };
    } catch (error) {
      setStatus("error");
      console.error("Failed to connect to WebSocket:", error);
    }
  }, [url, reconnectAttempts, reconnectInterval, onMessage, onError]);

  //disconnect logic
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual Disconnect");
      wsRef.current = null;
    }
    setStatus("disconnected");
    console.log("WebSocket Disconnected");
  }, []);

  useEffect(() => {
    connect();

    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    status,
    isConnected: status === "connected",
    latestMessage,
    metrics,
    connect,
    disconnect,
    messageHistory,
  };
}
