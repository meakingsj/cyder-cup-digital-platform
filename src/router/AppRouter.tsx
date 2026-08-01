import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import ScrollToTop from "../components/common/ScrollToTop";
import MainLayout from "../layouts/MainLayout";

import AboutPage from "../pages/About/AboutPage";
import GalleryPage from "../pages/Gallery/GalleryPage";
import HistoryPage from "../pages/History/HistoryPage";
import HomePage from "../pages/Home/HomePage";
import LivePage from "../pages/Live/LivePage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import PlayerProfilePage from "../pages/Players/PlayerProfilePage";
import PlayersPage from "../pages/Players/PlayersPage";
import RecordsPage from "../pages/Records/RecordsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          <Route
            index
            element={<HomePage />}
          />

          <Route
            path="live"
            element={<LivePage />}
          />

          <Route
            path="history"
            element={<HistoryPage />}
          />

          <Route
            path="gallery"
            element={<GalleryPage />}
          />

          <Route
            path="players"
            element={<PlayersPage />}
          />

          <Route
            path="players/:playerId"
            element={<PlayerProfilePage />}
          />

          <Route
            path="records"
            element={<RecordsPage />}
          />

          <Route
            path="about"
            element={<AboutPage />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}