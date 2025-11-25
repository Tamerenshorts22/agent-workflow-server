import express from "express";
import { runWorkflow } from "./workflow.js";

const app = express();

// Use PORT from Render if set, otherwise default to 3000 (for local runs)
const port = process.env.PORT || 3000;

// Let Express understand JSON bodies like { "input_as_text": "..." }
app.use(express.json());

// Simple health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Main endpoint called by n8n
app.post("/run-workflow", async (req, res) => {
  try {
    const { input_as_text } = req.body ?? {};

    // Basic validation: we require a non-empty string
    if (typeof input_as_text !== "string" || input_as_text.trim() === "") {
      return res.status(400).json({
        error: "Missing or invalid 'input_as_text'. It must be a non-empty string.",
      });
    }

    // Call your OpenAI-based workflow
    const result = await runWorkflow({ input_as_text });

    // Make absolutely sure we always return a JSON object
    return res.json({
      instructions: result?.instructions ?? "Send an email",
      body: result?.body ?? "",
    });
  } catch (error) {
    console.error("Error in /run-workflow:", error);
    return res.status(500).json({
      error: "Internal server error while running workflow.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Agent workflow server listening on port ${port}`);
});

export default app;
