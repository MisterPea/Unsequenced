import { createSlice } from '@reduxjs/toolkit';

interface NotifyPrefs {
  allowSounds: boolean;
  allowBanners: boolean | string;
}
const initialState: NotifyPrefs = {
  allowSounds: true,
  allowBanners: true,
};

const notificationPrefs = createSlice({
  name: 'notificationsPrefs',
  initialState,
  reducers: {
    populateAllowSounds: (
      state: { allowSounds: boolean, allowBanners: boolean | string; },
      action: { payload: { preference: boolean; }; },
    ) => ({
      ...state,
      allowSounds: action.payload.preference,
      allowBanners: state.allowBanners,
    }),
    populateAllowBanners: (
      state: { allowSounds: boolean, allowBanners: boolean | string; },
      action: { payload: { preference: string | boolean; }; },
    ) => ({
      ...state,
      allowSounds: state.allowSounds,
      allowBanners: action.payload.preference,
    }),
    toggleAllowSounds: (state: { allowSounds: boolean, allowBanners: boolean | string; }) => ({
      ...state,
      allowSounds: !state.allowSounds,
      allowBanners: state.allowBanners,
    }),
    selectAllowBanners: (
      state: { allowSounds: boolean, allowBanners: boolean | string; },
      action: { payload: { preference: string | boolean; }; },
    ) => ({
      ...state,
      allowSounds: state.allowSounds,
      allowBanners: action.payload.preference,
    }),
  },
});

export default notificationPrefs.reducer;
export const { toggleAllowSounds,
  selectAllowBanners,
  populateAllowBanners,
  populateAllowSounds } = notificationPrefs.actions;
