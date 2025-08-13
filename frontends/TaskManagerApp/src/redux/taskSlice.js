import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/tasks');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Fetch failed' });
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async ({ title, description }, { rejectWithValue }) => {
  try {
    const res = await api.post('/tasks', { title, description });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Create failed' });
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, title, description, status }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${id}`, { title, description, status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Update failed' });
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Delete failed' });
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload.message; })

      .addCase(createTask.fulfilled, (state, action) => { state.tasks.unshift(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
