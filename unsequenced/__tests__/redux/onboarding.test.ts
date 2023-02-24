import { setOnboarding } from '../../redux/firstRun';
import mockStore from '../../jest/testHelpers/mockStore';

describe('onboarding/first-run', () => {
  const storeRef = mockStore();

  it('should have initial state of true', () => {
    const { isFirstRun } = storeRef.store!.getState().firstRun;
    expect(isFirstRun).toBeTruthy();
  });

  it('should change the value of isFirstRun from true to false', () => {
    storeRef.store!.dispatch(setOnboarding({ isFirstRun: false }));
    const { isFirstRun } = storeRef.store!.getState().firstRun;
    expect(isFirstRun).toBeFalsy();
  });
});
