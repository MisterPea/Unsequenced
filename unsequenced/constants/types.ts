import React from 'react';

/**
 * Screen Modes
 */
export interface ScreenElements {
  statusBar:('light'|'dark');
  colorScheme:('light'|'dark');
}

export interface ScreenModeProps {
  children: React.ReactElement;
  callback: (screenMode: ScreenElements) => void;
}
