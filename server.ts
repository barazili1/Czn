import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON and text/raw bodies
  app.use(express.json());
  app.use(express.text({ type: "*/*" }));

  // API proxy endpoint to bypass client CORS / ad-blocker issues
  app.all("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    try {
      console.log(`[Proxy] Routing ${req.method} request to: ${targetUrl}`);
      
      const headers: Record<string, string> = {};
      if (req.headers["content-type"]) {
        headers["Content-Type"] = req.headers["content-type"] as string;
      }

      const axiosConfig: any = {
        method: req.method,
        url: targetUrl,
        headers,
        validateStatus: () => true, // Don't throw on non-2xx status codes
      };

      if (req.method !== "GET" && req.method !== "HEAD") {
        axiosConfig.data = req.body;
      }

      const response = await axios(axiosConfig);
      
      const contentType = String(response.headers["content-type"] || "");
      res.status(response.status);
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }
      
      // Send data
      if (typeof response.data === "object") {
        res.json(response.data);
      } else {
        res.send(response.data);
      }
    } catch (err: any) {
      console.error("[Proxy Error]:", targetUrl, err);
      res.status(500).json({ error: "Proxy failed", details: err.message });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
