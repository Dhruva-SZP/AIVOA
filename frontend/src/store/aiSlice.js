import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { analyzeText, analyzeUpload } from "../api/client.js";

export const runAnalyzeText = createAsyncThunk(
  "ai/runAnalyzeText",
  async ({ rawText, sourceType }) => analyzeText(rawText, sourceType)
);

export const runAnalyzeUpload = createAsyncThunk(
  "ai/runAnalyzeUpload",
  async (file) => analyzeUpload(file)
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    status: "idle", // idle | loading | succeeded | failed
    result: null, // AICopilotResult from the LangGraph run
    error: null,
  },
  reducers: {
    clearAnalysis(state) {
      state.status = "idle";
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = "loading";
      state.error = null;
    };
    const fulfilled = (state, action) => {
      state.status = "succeeded";
      state.result = action.payload;
    };
    const rejected = (state, action) => {
      state.status = "failed";
      state.error =
        action.error?.message || "AI Copilot could not analyze this submission.";
    };

    builder
      .addCase(runAnalyzeText.pending, pending)
      .addCase(runAnalyzeText.fulfilled, fulfilled)
      .addCase(runAnalyzeText.rejected, rejected)
      .addCase(runAnalyzeUpload.pending, pending)
      .addCase(runAnalyzeUpload.fulfilled, fulfilled)
      .addCase(runAnalyzeUpload.rejected, rejected);
  },
});

export const { clearAnalysis } = aiSlice.actions;
export default aiSlice.reducer;
