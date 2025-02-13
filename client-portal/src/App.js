import { Routes, Route } from "react-router-dom";
import Home from './clientpages/home';
import CoreTracking from "./clientpages/coreTracking";
import HomePage from "./HomePage";
import MapTracking from "./clientpages/mapTracking";
import Login from "./login";
import "./App.css"
import ProtectedRoute from "./auth/protectedRoutes"; // Correct import
import SP from "./clientpages/supportCenter";
import ReportViewer from "./clientpages/reportViewer";
import PointIntrest from "./clientpages/pointofintrest";
import SupportCenter from "./clientpages/supportCenter";
import { AuthProvider } from "./contexts/AuthContext";
import ReportGenerator from "./reportGenerator";
import Reports from "./clientpages/reports";
import axios from "axios";
import AssetsInfo from "./clientpages/assetInfo";

axios.defaults.baseURL = "http://148.113.44.181:7026"


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/media/reports" element={<ReportGenerator />} />

        {/* Protect these routes with ProtectedRoute */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/core-tracking"
          element={
            <ProtectedRoute>
              <CoreTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map-tracking"
          element={
            <ProtectedRoute>
              <MapTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports-center/viewer"
          element={
            <ProtectedRoute>
              <ReportViewer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/point-of-intrest"
          element={
            <ProtectedRoute>
              <PointIntrest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support-center"
          element={
            <ProtectedRoute>
              <SupportCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

<Route
          path="/assets-info"
          element={
            <ProtectedRoute>
              <AssetsInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
