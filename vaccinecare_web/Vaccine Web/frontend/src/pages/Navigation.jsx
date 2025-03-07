import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/features/api/authApi";
import { userLoggedOut } from "@/features/authSlice";


const Navigation = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation(); // Use mutation instead of query

  const handleLogout = async () => {
    try {
      await logout().unwrap(); 
      dispatch(userLoggedOut()); 
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary">
            Vaccine <span className="text-blue-700">Care</span>
          </Link>
          
          {user && (
            <nav className="ml-8 hidden md:flex items-center space-x-4">
              {user.Role === "admin" &&<Link to="/dashboard/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>}
              {user.Role === "hospitals" &&<Link to="/dashboard/hospital" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>}
              {user.Role === "admin" && (
                <Link to="/hospitals" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Hospitals
                </Link>
              )}
              {(user.Role === "hospitals" ) && (
                <Link to="/dashboard/workers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Workers
                </Link>
              )}
              {(user.Role === "hospitals" || user.Role === "healthcare_worker")&&(<Link to="/dashboard/certificates" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Certificates
              </Link>)}
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user.email}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/sginup")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;