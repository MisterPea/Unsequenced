import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PillButtonFilled from '../../components/PillButtonFilled';

describe('PillButtonFilled Component', () => {
  it('Should render the component without crashing', () => {
    render(
      <PillButtonFilled
        label="Test Button"
        size="lg"
        colors={{ text: '#ffffff', background: '#000000' }}
      />,
    );
  });

  it('Should call a function on a click', async () => {
    const spyFunc = jest.fn();
    const { findByTestId } = render(
      <PillButtonFilled
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
