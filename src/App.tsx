import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import grey from '@material-ui/core/colors/grey';
import Main from '@src/components/Main';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: grey,
  },
  typography: {
    fontFamily: ['Noto Sans', 'sans-serif'].join(','),
    fontSize: 12,
    h1: {
      fontSize: '1.75rem',
    },
    h2: {
      fontSize: '1.5rem',
    },
    h3: {
      fontSize: '1.25rem',
    },
    h4: {
      fontSize: '1.125rem',
    },
    h5: {
      fontSize: '1rem',
    },
    h6: {
      fontSize: '1rem',
    },
  },
});

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Main />
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
