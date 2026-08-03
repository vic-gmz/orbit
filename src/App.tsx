import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthGuard from "./components/auth/AuthGuard";
import Layout from "./components/layout/Layout";
import DashboardPage from "./components/dashboard/DashboardPage";
import CompaniesPage from "./components/companies/CompaniesPage";
import CompanyForm from "./components/companies/CompanyForm";
import CompanyDetail from "./components/companies/CompanyDetail";
import ContactsPage from "./components/contacts/ContactsPage";
import ContactForm from "./components/contacts/ContactForm";
import ContactDetail from "./components/contacts/ContactDetail";
import StatsPage from "./components/stats/StatsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "companies", element: <CompaniesPage /> },
          { path: "companies/new", element: <CompanyForm /> },
          { path: "companies/:id", element: <CompanyDetail /> },
          { path: "contacts", element: <ContactsPage /> },
          { path: "contacts/new", element: <ContactForm /> },
          { path: "contacts/:id", element: <ContactDetail /> },
          { path: "stats", element: <StatsPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
