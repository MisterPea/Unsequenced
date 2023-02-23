import { createSlice } from '@reduxjs/toolkit';

const initialState: { isFirstRun: boolean; } = { isFirstRun: true };

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboarding: (state: { isFirstRun: boolean; }, action: { payload: { isFirstRun: boolean; }; }) => {
      const { isFirstRun } = action.payload;
      return { ...state, isFirstRun };
    },
  },
});

export default onboardingSlice.reducer;
export const { setOnboarding } = onboardingSlice.actions;
