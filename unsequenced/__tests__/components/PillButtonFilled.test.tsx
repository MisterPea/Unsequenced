import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PillButton from '../../components/PillButton';

describe('PillButton Component', () => {
  it('Should render the component without crashing', () => {
    render(
      <PillButton
        label="Test Button"
        size="lg"
        colors={{ text: '#ffffff', background: '#000000' }}
      />,
    );
  });

  it('Should call a function on a click', async () => {
    const spyFunc = jest.fn();
    const { findByTestId } = render(
      <PillButton
        label="Test Button"
        size="lg"
        colors={{ text: '#ffffff', background: '#000000' }}
        action={spyFunc}
      />,
    );

    const button = await findByTestId('pillButtonFilledId');
    fireEvent(button, 'press');
    expect(spyFunc).toHaveBeenCalled();
  });
});
