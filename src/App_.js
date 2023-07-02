import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";
import Sales from "./pages/sales/Sales";
import ViewSale from "./pages/sales/ViewSale";
import Invoice from "./pages/invoices/Invoice";
import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import Customers from "./pages/customers/Customers";
import AddCustomer from "./pages/customers/AddCustomer";
import ViewCustomerLocations from "./pages/customers/ViewCustomerLocations";
import Teams from "./pages/teams/Teams";
import Sidebar from "./components/sidebar/Sidebar";
import TopNavBar from "./components/nav/TopNavBar";
import Account from "./pages/account/Account";
import AccountWrapper from "./pages/account/AccountWrapper";
import AddTeamMember from "./pages/users/AddTeamMember";
import AddTeam from "./pages/teams/AddTeam";
import AddCategory from "./pages/products/AddCategory";
import AddCampaign from "./pages/dashboard/AddCampaign";
import User from "./pages/users/User";
import { UserContext } from "./components/context/UserContext";
import VisitedLocations from "./pages/dashboard/VisitedLocations";
import Agents from "./pages/agents/Agents";
import { authToken } from "./components/settings/Authentication";
import Users from "./pages/users/Users";
import { AuthContext } from "./components/context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [sidebar, setSideBar] = useState(false);
  const [topNav, setTopNav] = useState(false);
  const [userBusiness, setUserBusiness] = useState({});
  const [businessCampaigns, setBusinessCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState(0);
  const [isCampaignAdded, setIsCampaignAdded] = useState(false)
  const [isAuth, setIsAuth]= useState(false);

  useEffect(()=>{
    const currentUrl = new URL(window.location.href);

    if(authToken()){
      setSideBar(true)
      setTopNav(true)

      if(currentUrl.pathname == "/"){
        window.location.replace("/dashboard");
      }

    }else{
      setSideBar(false)
      setTopNav(false)
    }
  },[isAuth])

  return (
    <div className="App">
      <UserContext.Provider value={{userBusiness, setUserBusiness, topNav, 
        setTopNav, businessCampaigns, setBusinessCampaigns, campaignId, setCampaignId,
         setIsAuth,isAuth, setActiveLink, sidebar,setSideBar, setTopNav, isCampaignAdded, setIsCampaignAdded}}>
        <BrowserRouter>
          <Sidebar sidebar={sidebar} activeLink={activeLink} setActiveLink={setActiveLink}/>
          <div className="main-container">
            <TopNavBar />
            <Routes>
              <Route path="/" element={<LoginPage setSideBar={setSideBar} />} />
              <Route
                path="/dashboard"
                element={
                  <Dashboard  />
                }
              />
                 <Route
                path="/locations"
                element={
                  <VisitedLocations/>
                }
              />
              <Route
                path="/add-campaign"
                element={<AddCampaign />}
              />
              <Route
                path="/sales"
                element={<Sales  />}
              />
                <Route
                path="/agents"
                element={<Agents  />}
              />
              <Route
                path="/view-sales"
                element={<ViewSale />}
              />
              <Route path="/invoices" element={<Invoice />} />
              <Route
                path="/products"
                element={<Products  />}
              />
              <Route
                path="/add-product"
                element={<AddProduct  />}
              />
              <Route
                path="/add-category"
                element={<AddCategory />}
              />
              <Route
                path="/customers"
                element={<Customers />}
              />
              <Route
                path="/add-customer"
                element={<AddCustomer  />}
              />
              <Route
                path="/view-customer-locations"
                element={<ViewCustomerLocations  />}
              />
              
              <Route
                path="/users"
                element={<Users  />}
              />

              <Route
                path="/teams"
                element={<Teams  />}
              />

              <Route
                path="/add-team"
                element={<AddTeam setSideBar={setSideBar} />}
              />

              <Route
                path="/add-team-member"
                element={<AddTeamMember setSideBar={setSideBar} />}
              />

              <Route path="/user" element={<User setSideBar={setSideBar} />} />

              <Route
                path="/account"
                element={<AccountWrapper setSideBar={setSideBar} />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
