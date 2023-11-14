import React from "react";
import { ThemeProvider } from "styled-components";
import theme from "./theme";

const withThemeProvider = (Component) => () => {
  return (
    <ThemeProvider theme={theme}>
      <Component />
    </ThemeProvider>
  );
};

export default withThemeProvider;
