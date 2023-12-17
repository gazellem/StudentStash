import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import ListingPage from "./pages/listingPage";
import ProfilePage from "./pages/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import SearchPage from "./pages/searchPage";
import FilterPage from "./pages/filterPage";
import ReportPage from "./pages/reportPage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/listing/:listingId"
              element={isAuth ? <ListingPage /> : <Navigate to="/" />}
            />
            <Route
                path="/report/:reportId"
                element={isAuth ? <ReportPage /> : <Navigate to="/" />}
            />
            <Route
                path="/profile/:username"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
                path="/search"
                element={isAuth ? <SearchPage /> : <Navigate to="/" />}
            />
            <Route
                path="/filter/:filter"
                element={isAuth ? <FilterPage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;