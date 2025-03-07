import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/features/api/authApi";
import { userLoggedOut } from "@/features/authSlice";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";

const Navigation = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(userLoggedOut());
      setIsLogoutDialogOpen(false); // Close the dialog
      navigate("/");
      toast.success("Logged out successfully!", {
        description: "You have been signed out.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <header className="border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-black">
              Vaccine <span className="text-blue-700">Care</span>
            </Link>

            {user && (
              <nav className="ml-8 hidden md:flex items-center space-x-4">
                {user.Role === "admin" && (
                  <Link to="/dashboard/admin" className="text-sm font-medium text-black/90 hover:text-gray-900 transition-colors">
                    Dashboard
                  </Link>
                )}
                {user.Role === "hospitals" && (
                  <Link to="/dashboard/hospital" className="text-sm font-medium text-black/90 hover:text-gray-900 transition-colors">
                    Dashboard
                  </Link>
                )}
                {user.Role === "admin" && (
                  <Link to="/hospitals" className="text-sm font-medium text-black/90 hover:text-gray-900 transition-colors">
                    Hospitals
                  </Link>
                )}
                {(user.Role === "hospitals") && (
                  <Link to="/dashboard/workers" className="text-sm font-medium text-black/90 hover:text-gray-900 transition-colors">
                    Workers
                  </Link>
                )}
                {(user.Role === "hospitals" || user.Role === "healthcare_worker") && (
                  <Link to="/dashboard/certificates" className="text-sm font-medium text-black/90 hover:text-gray-900 transition-colors">
                    Certificates
                  </Link>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-black">{user.name}</div>
                  <div className="text-xs text-black/80 capitalize">{user.email}</div>
                </div>

                {/* Logout Dialog */}
                <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-gray-400 hover:bg-gray-500 text-black border-none">
                      Sign Out
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">Confirm Logout</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Are you sure you want to sign out?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 pt-4">
                      <DialogClose asChild>
                        <Button variant="outline" className="hover:bg-gray-100">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleLogout}
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging Out...
                          </>
                        ) : (
                          "Sign Out"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="bg-gray-400 hover:bg-gray-500 text-black border-none" onClick={() => navigate("/sginup")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navigation;