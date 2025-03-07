import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, MapPin, Phone, Mail, Building, Search, AlertCircle } from "lucide-react";
import { useAddHospitalMutation, useGetHospitalQuery, useSearchHospitalsQuery } from "@/features/api/authApi";
import Navigation from "../Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import debounce from 'lodash/debounce';
import { toast, Toaster } from 'sonner'; // Import toast and Toaster from sonner

const HospitalDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: hospitals, error, isLoading, refetch } = useGetHospitalQuery();
  const [addHospital] = useAddHospitalMutation();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    contact_number: "",
    state: "",
    email: "",
    password: "",
  });

  const { data: searchResults, isLoading: isSearching } = useSearchHospitalsQuery(searchQuery, { 
    skip: !searchQuery,
    refetchOnMountOrArgChange: true 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addHospital(formData).unwrap();
      setFormData({ 
        name: "", 
        address: "", 
        city: "", 
        contact_number: "", 
        state: "", 
        email: "", 
        password: "" 
      });
      // Show success toast
      toast.success("Hospital added successfully!", {
        description: "The hospital has been added to the system.",
      });
      refetch();
    } catch (error) {
      console.error("Failed to add hospital:", error);
      // Show error toast
      toast.error("Failed to add hospital", {
        description: error?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const displayedHospitals = searchQuery ? searchResults?.data : hospitals?.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navigation />
      {/* Add Toaster for notifications */}
      <Toaster position="top-right" richColors />

      <div className="container mx-auto p-6 space-y-8">
        {showSuccessAlert && (
          <Alert className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Hospital added successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Hospital Management</h1>
              <p className="text-gray-200 mt-2">Manage and monitor all registered hospitals</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Input
                  type="text"
                  placeholder="Search hospitals..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="pl-10 w-full bg-white/90 backdrop-blur-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-white text-blue-700 hover:bg-white/90 transition-colors whitespace-nowrap">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Hospital
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Add a New Hospital</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Form Fields */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Hospital Name</Label>
                      <Input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter hospital name"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Address</Label>
                      <Input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        className="focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter complete address"
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">City</Label>
                        <Input 
                          type="text" 
                          name="city" 
                          value={formData.city} 
                          onChange={handleChange} 
                          className="focus:ring-2 focus:ring-blue-500"
                          placeholder="City"
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">State</Label>
                        <Input 
                          type="text" 
                          name="state" 
                          value={formData.state} 
                          onChange={handleChange} 
                          className="focus:ring-2 focus:ring-blue-500"
                          placeholder="State"
                          required 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Contact Number</Label>
                        <Input 
                          type="tel" 
                          name="contact_number" 
                          value={formData.contact_number} 
                          onChange={handleChange} 
                          className="focus:ring-2 focus:ring-blue-500"
                          placeholder="Contact number"
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Email</Label>
                        <Input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          className="focus:ring-2 focus:ring-blue-500"
                          placeholder="Email address"
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Password</Label>
                      <Input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter secure password"
                        required 
                      />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <DialogClose asChild>
                        <Button variant="outline" className="hover:bg-gray-100">Cancel</Button>
                      </DialogClose>
                      <Button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        Add Hospital
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Hospital Cards Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {searchQuery ? 'Search Results' : 'All Hospitals'}
          </h2>
          
          {(isLoading || isSearching) && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 mx-auto mb-2" />
              Error loading hospitals. Please try again later.
            </div>
          )}

          {!isLoading && !error && displayedHospitals?.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No hospitals found</p>
            </div>
          )}

          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedHospitals?.map((hospital, index) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 bg-white transform hover:-translate-y-1 border-l-4 border-blue-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-xl text-gray-800">
                        <Building className="h-5 w-5 mr-2 text-blue-600" />
                        {hospital.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                        <p className="line-clamp-2">{hospital.address}, {hospital.city}, {hospital.state}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                        <p>{hospital.contact_number}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                        <p className="truncate">{hospital.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;