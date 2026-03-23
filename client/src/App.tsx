import { Navigate, Route, Routes } from "react-router-dom";
import GroupPage from "./pages/GroupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/group" element={<GroupPage />} />
    </Routes>
  );
}

export default App;
