import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react-native';
import NowPlaying from '../../screens/NowPlaying';
import store from '../../redux/store';
import DATA from '../../constants/DATA';

const stumpNav:any = {
  navigation: {
    navigate: () => {},
  },
  route: {
    params: {
      id: DATA[0].id,
      title: DATA[0].title,
    },
  },
};

describe('Now Playing.tsx', () => {
  it('Renders the component', () => {
    render(<Provider store={store}><NowPlaying route={stumpNav.route} navigation={stumpNav.navigation} /></Provider>);
  });

  it('Renders the appropriate tile', () => {
    render(<Provider store={store}><NowPlaying route={stumpNav.route} navigation={stumpNav.navigation} /></Provider>);
    const correctTitle = DATA[0].title;
    const title = screen.findAllByText(correctTitle);
    expect(title).toBeTruthy();
  });
});
