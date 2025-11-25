import express, { Request, Response } from "express";
import { runWorkflow } from "./workflow.js";

const app = express();

// Use PORT env var if set, otherwise default to 3000
const port = process.env.PORT ?? 3000;

// Let Express understand JSON bodies like { "input_as_text": "..." }
app.use(express.json());

// Health check (for debugging / Render status)
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Main workflow endpoint:
// POST /run-workflow
// Body: { "input_as_text": "some text" }
app.post("/run-workflow", async (req: Request, res: Response) => {
  try {
    const body = req.body as { input_as_text?: string };

    if (!body.input_as_text || typeof body.input_as_text !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'input_as_text' in request body."
      });
    }

    // Call your workflow function
    const result = await runWorkflow({
      input_as_text: body.input_as_text
    });

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
