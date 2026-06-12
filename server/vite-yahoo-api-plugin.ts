import type { Connect, Plugin } from "vite";

import { fetchStockQuote } from "./yahoo-quote";

function createQuoteHandler(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith("/api/quote")) {
      next();
      return;
    }

    const url = new URL(req.url, "http://localhost");
    const symbol = url.searchParams.get("symbol");

    if (!symbol) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "symbol is required" }));
      return;
    }

    try {
      const quote = await fetchStockQuote(symbol);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(quote));
    } catch (error) {
      console.error("[yahoo-finance-api]", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error:
            error instanceof Error ? error.message : "Failed to fetch quote",
        })
      );
    }
  };
}

export function yahooFinanceApiPlugin(): Plugin {
  const handler = createQuoteHandler();

  return {
    name: "yahoo-finance-api",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
