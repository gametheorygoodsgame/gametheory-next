'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  colors: {
    brand: [
      '#0dcd83',
      '#0e8e95',
      '#1195a7',
      '#1a839a',
      '#216980',
      '#265980',
      '#3a4d74',
      '#334d80',
      '#002060',
      '#F26C4F',
    ],
  },
  components: {
    Button: {
      styles: {
        root: {
          backgroundColor: 'brand-8',
        },
      },
    },
    Title: {
      styles: {
        root: {
          color: 'white',
          textAlign: 'center',
          fontFamily: 'Castellar, sans-serif',
          fontWeight: 800,
        },
        left: {
          color: 'white',
          textAlign: 'left',
          fontFamily: 'Castellar, sans-serif',
          fontWeight: 700,
        },
      },
    },
  },
  primaryColor: 'brand',
  fontFamily: 'Instrument Sans, sans-serif',
});
