import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import RecoverAccount from "../pages/RecoverAccount/RecoverAccount";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import AllProjects from "../pages/AllProjects/AllProjects";
import ProjectDetails from "../pages/ProjectDetails/ProjectDetails";
import AllTasks from "../pages/AllTasks/AllTasks";
import TaskDetails from "../pages/TaskDetails/TaskDetails";
import EditProject from "../pages/EditProject/EditProject";
import EditTask from "../pages/EditTask/EditTask";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import CreateTask from "../pages/CreateTask/CreateTask";
import CreateProject from "../pages/CreateProject/CreateProject";
import Settings from "../pages/Settings/Settings";
import RecycleBin from "../pages/RecycleBin/RecycleBin";
import Organization from "../pages/Organization/Organization";
import Help from "../pages/Help/Help";
import Sessions from "../pages/Sessions/Sessions";
import NotFound from "../pages/NotFound/NotFound";

function ProtectedRoute({ children }) {
  const session = JSON.parse(localStorage.getItem("taskflowSession") || "null");
  const token = localStorage.getItem("taskflowToken");

  return session?.loggedIn && token ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><AllProjects /></ProtectedRoute>} />
        <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><AllTasks /></ProtectedRoute>} />
        <Route path="/tasks/:taskId" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
        <Route path="/projects/:projectId/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
        <Route path="/tasks/:taskId/edit" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/create-task" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/recycle-bin" element={<ProtectedRoute><RecycleBin /></ProtectedRoute>} />
        <Route path="/organization" element={<ProtectedRoute><Organization /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-account" element={<RecoverAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;