import express from "express";
import { runWorkflow } from "./workflow.js";

const app = express();

// Use PORT env var if set, otherwise default to 3000
const port = process.env.PORT || 3000;

// Let Express understand JSON bodies like { "input_as_text": "..." }
app.use(express.json());

// Health check (optional but nice for debugging)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Main endpoint for n8n
app.post("/run-workflow", async (req, res) => {
  try {
    const { input_as_text } = req.body ?? {};

    if (typeof input_as_text !== "string" || input_as_text.trim() === "") {
      return res.status(400).json({
        error: "Missing or invalid 'input_as_text'. It must be a non-empty string."
      });
    }

    // Call your existing workflow as a black box
    const result = await runWorkflow({ input_as_text });

    // result should look like: { instructions: "Send an email", body: "..." }
    return res.json(result);
  } catch (error) {
    console.error("Error in /run-workflow:", error);
    return res.status(500).json({
      error: "Internal server error while running workflow."
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Agent workflow server listening on port ${port}`);
});
