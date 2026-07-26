import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createComplaint, listComplaints } from "../api/client.js";

const emptyForm = {
  customer_name: "",
  customer_email: "",
  product_name: "",
  batch_number: "",
  market_country: "",
  quantity_affected: "",
  complaint_category: "",
  date_of_occurrence: "",
  description: "",
};

export const fetchComplaints = createAsyncThunk("complaints/fetchAll", async () =>
  listComplaints()
);

export const saveComplaint = createAsyncThunk(
  "complaints/save",
  async (_, { getState }) => {
    const { complaints } = getState();
    const payload = {
      ...complaints.formDraft,
      source_type: complaints.sourceType,
      source_filename: complaints.sourceFilename,
      raw_text: complaints.rawText,
      ai_result: complaints.aiResultForSave,
    };
    return createComplaint(payload);
  }
);

const complaintsSlice = createSlice({
  name: "complaints",
  initialState: {
    items: [],
    listStatus: "idle",
    formDraft: { ...emptyForm },
    aiFilledFields: [], // which field keys were auto-populated, for the teal highlight
    rawText: "",
    sourceType: "manual",
    sourceFilename: null,
    aiResultForSave: null,
    saveStatus: "idle",
  },
  reducers: {
    setField(state, action) {
      const { field, value } = action.payload;
      state.formDraft[field] = value;
    },
    setRawText(state, action) {
      state.rawText = action.payload;
    },
    setSource(state, action) {
      state.sourceType = action.payload.sourceType;
      state.sourceFilename = action.payload.sourceFilename || null;
    },
    populateFromAI(state, action) {
      const extracted = action.payload.extracted || {};
      const filled = [];
      Object.keys(emptyForm).forEach((key) => {
        if (extracted[key]) {
          state.formDraft[key] = extracted[key];
          filled.push(key);
        }
      });
      state.aiFilledFields = filled;
      state.aiResultForSave = action.payload;
    },
    resetForm(state) {
      state.formDraft = { ...emptyForm };
      state.aiFilledFields = [];
      state.rawText = "";
      state.sourceType = "manual";
      state.sourceFilename = null;
      state.aiResultForSave = null;
      state.saveStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(saveComplaint.pending, (state) => {
        state.saveStatus = "loading";
      })
      .addCase(saveComplaint.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(saveComplaint.rejected, (state) => {
        state.saveStatus = "failed";
      });
  },
});

export const { setField, setRawText, setSource, populateFromAI, resetForm } =
  complaintsSlice.actions;
export default complaintsSlice.reducer;
