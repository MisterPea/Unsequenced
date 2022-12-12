import notificationPrefs, { toggleAllowSounds, toggleAllowBanners } from '../../redux/notificationPrefs';

const initialState = {
  allowSounds: true,
  allowBanners: true,
};

describe('notificationPrefs reducer', () => {
  it('should handle initial state', () => {
    expect(notificationPrefs(undefined, {})).toEqual(initialState);
  });

  it('should handle toggleAllowSounds', () => {
    expect(notificationPrefs(
      { allowSounds: true, allowBanners: true },
      toggleAllowSounds(),
    )).toEqual({ allowSounds: false, allowBanners: true });
  });

  it('should handle toggleAllowBanners', () => {
    expect(notificationPrefs(
      { allowSounds: true, allowBanners: true },
      toggleAllowBanners(),
    )).toEqual({ allowSounds: true, allowBanners: false });
  });
});
