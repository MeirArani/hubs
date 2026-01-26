import { createTheme, adaptV4Theme } from "@mui/material/styles";
import { defaultTheme } from "react-admin";

export const adminTheme = createTheme(
  adaptV4Theme({
    ...defaultTheme,
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#222222",
            minHeight: "100vh"
          }
        }
      }
    },
    palette: {
      primary: {
        main: "#1700c7"
      },
      secondary: {
        main: "#000000"
      }
    },
    typography: {
      fontFamily: "Inter,Arial"
    }
  })
);
