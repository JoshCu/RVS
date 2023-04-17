import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Grade {
  id: string;
  course: string;
  date: Date;
  grade: string;
  score: number;
}

interface GradeState {
  grades: Grade[]
}

const initialState: GradeState = {
  grades: []
}

export const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {
    setGrades: (state, action: PayloadAction<Grade[]>) => {
      state.grades = action.payload;
    }
  }
});

export const { setGrades } = gradeSlice.actions;

export default gradeSlice.reducer;
