import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
   Loader2,
   PlusCircle,
   Search,
   AlertCircle,
   User,
   Briefcase,
   Calendar,
   Phone,
   MapPin,
   Mail,
   Lock,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import debounce from "lodash/debounce";
import { useAddworkerMutation, useGetworkerQuery, useSearchworkerQuery } from "@/features/api/authApi";
import Navigation from "../Navigation";

const WorkerDashboard = () => {
   const user = useSelector((state) => state.auth.user);
   const id = user?.hospital_id;

   // State
   const [searchQuery, setSearchQuery] = useState("");
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      qualification: "",
      age: "",
      contact_number: "",
      city: "",
      state: "",
      email: "",
      password: "",
      hospital_id: id,
   });

   // RTK Query hooks
   const { data: workers, error: fetchError, isLoading, refetch } = useGetworkerQuery({ id });
   const [addWorker, { isLoading: isAdding, error: addError }] = useAddworkerMutation();
   const { data: searchedWorkers, isLoading: isSearching } = useSearchworkerQuery(
      { query: searchQuery, hospital_id: id },
      { skip: !searchQuery }
   );

   // Derived state
   const displayedWorkers = searchQuery ? searchedWorkers?.workers : workers?.workers;

   // Error handling effect
   useEffect(() => {
      if (fetchError) {
         toast.error("Error loading workers", {
            description: "Failed to load workers list. Please try again.",
         });
      }
   }, [fetchError]);

   // Handlers
   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await addWorker({ ...formData, hospital_id: id }).unwrap();

         toast.success("Worker added successfully", {
            description: `${formData.name} has been added to your team.`,
         });

         // Reset form and state
         setFormData({
            name: "",
            qualification: "",
            age: "",
            contact_number: "",
            city: "",
            state: "",
            email: "",
            password: "",
            hospital_id: id,
         });
         setIsDialogOpen(false);
         refetch();
      } catch (error) {
         toast.error("Failed to add worker", {
            description: error?.data?.message || "Something went wrong. Please try again.",
         });
      }
   };

   const debouncedSearch = useCallback(
      debounce((query) => {
         setSearchQuery(query);
      }, 300),
      []
   );

   // Cleanup effect
   useEffect(() => {
      return () => {
         debouncedSearch.cancel();
      };
   }, [debouncedSearch]);

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
         <Navigation />
         <Toaster position="top-right" richColors />

         <div className="container mx-auto p-6 space-y-6">
            {/* Upper Content Box */}
            <div className="bg-blue-600 text-white rounded-lg shadow-sm p-6 border border-gray-100">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                     <h1 className="text-3xl font-bold text-white">Worker Management</h1>
                     <p className="text-white mt-2">Manage and monitor all registered workers</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                     <div className="relative flex-grow sm:flex-grow-0">
                        <Input
                           type="text"
                           className="pl-10 w-full text-white" 
                           placeholder="Search workers..."
                           onChange={(e) => debouncedSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                     </div>

                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                           <Button variant="default" className="bg-blue-600 hover:bg-blue-700 transition-colors whitespace-nowrap">
                              <PlusCircle className="mr-2 h-5 w-5" /> Add Worker
                           </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[525px]">
                           <div className="border-b pb-4 mb-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Add New Worker</h2>
                              <DialogDescription className="text-gray-500 mt-1">
                                 Enter the worker's details below
                              </DialogDescription>
                           </div>

                           <form onSubmit={handleSubmit} className="space-y-5">
                              {/* Name Field */}
                              <div className="space-y-2">
                                 <Label className="text-sm font-medium">Full Name</Label>
                                 <div className="relative">
                                    <Input
                                       type="text"
                                       name="name"
                                       value={formData.name}
                                       onChange={handleChange}
                                       className="pl-10 focus:ring-2 focus:ring-blue-500"
                                       placeholder="Enter full name"
                                       required
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                 </div>
                              </div>

                              {/* Qualification Field */}
                              <div className="space-y-2">
                                 <Label className="text-sm font-medium">Qualification</Label>
                                 <div className="relative">
                                    <Input
                                       type="text"
                                       name="qualification"
                                       value={formData.qualification}
                                       onChange={handleChange}
                                       className="pl-10 focus:ring-2 focus:ring-blue-500"
                                       placeholder="Enter qualification"
                                       required
                                    />
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                 </div>
                              </div>

                              {/* Age and Contact Fields */}
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label className="text-sm font-medium">Age</Label>
                                    <div className="relative">
                                       <Input
                                          type="number"
                                          name="age"
                                          value={formData.age}
                                          onChange={handleChange}
                                          className="pl-10 focus:ring-2 focus:ring-blue-500"
                                          placeholder="Age"
                                          required
                                       />
                                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-sm font-medium">Contact Number</Label>
                                    <div className="relative">
                                       <Input
                                          type="tel"
                                          name="contact_number"
                                          value={formData.contact_number}
                                          onChange={handleChange}
                                          className="pl-10 focus:ring-2 focus:ring-blue-500"
                                          placeholder="Phone number"
                                          required
                                       />
                                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                 </div>
                              </div>

                              {/* City and State Fields */}
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label className="text-sm font-medium">City</Label>
                                    <div className="relative">
                                       <Input
                                          type="text"
                                          name="city"
                                          value={formData.city}
                                          onChange={handleChange}
                                          className="pl-10 focus:ring-2 focus:ring-blue-500"
                                          placeholder="City"
                                          required
                                       />
                                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-sm font-medium">State</Label>
                                    <div className="relative">
                                       <Input
                                          type="text"
                                          name="state"
                                          value={formData.state}
                                          onChange={handleChange}
                                          className="pl-10 focus:ring-2 focus:ring-blue-500"
                                          placeholder="State"
                                          required
                                       />
                                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                 </div>
                              </div>

                              {/* Email Field */}
                              <div className="space-y-2">
                                 <Label className="text-sm font-medium">Email</Label>
                                 <div className="relative">
                                    <Input
                                       type="email"
                                       name="email"
                                       value={formData.email}
                                       onChange={handleChange}
                                       className="pl-10 focus:ring-2 focus:ring-blue-500"
                                       placeholder="Email address"
                                       required
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                 </div>
                              </div>

                              {/* Password Field */}
                              <div className="space-y-2">
                                 <Label className="text-sm font-medium">Password</Label>
                                 <div className="relative">
                                    <Input
                                       type="password"
                                       name="password"
                                       value={formData.password}
                                       onChange={handleChange}
                                       className="pl-10 focus:ring-2 focus:ring-blue-500"
                                       placeholder="Create password"
                                       required
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                 </div>
                              </div>

                              {/* Form Actions */}
                              <div className="flex justify-end gap-4 pt-4 border-t">
                                 <DialogClose asChild>
                                    <Button
                                       type="button"
                                       variant="outline"
                                       className="hover:bg-gray-100"
                                    >
                                       Cancel
                                    </Button>
                                 </DialogClose>
                                 <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                    disabled={isAdding}
                                 >
                                    {isAdding ? (
                                       <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Adding...
                                       </>
                                    ) : (
                                       'Add Worker'
                                    )}
                                 </Button>
                              </div>
                           </form>
                        </DialogContent>
                     </Dialog>
                  </div>
               </div>
            </div>

            {/* Workers List Section */}
            <div className="mt-8">
               <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {searchQuery ? 'Search Results' : 'All Workers'}
               </h2>

               {/* Loading State */}
               {(isLoading || isSearching) && (
                  <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
                     <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                     <p className="text-gray-600">Loading workers...</p>
                  </div>
               )}

               {/* Error State */}
               {fetchError && (
                  <div className="text-center text-red-500 py-4 bg-red-50 rounded-lg">
                     <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                     <p>Error loading workers. Please try again later.</p>
                  </div>
               )}

               {/* Empty State */}
               {!isLoading && !fetchError && (!displayedWorkers || displayedWorkers.length === 0) && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                     <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                     <p className="text-gray-600">
                        {searchQuery ? 'No workers found matching your search' : 'No workers added yet'}
                     </p>
                  </div>
               )}

               {/* Workers Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedWorkers?.map((worker) => (
                     <Card
                        key={worker.id}
                        className="hover:shadow-lg transition-all duration-300 bg-white transform hover:-translate-y-1 border-l-4 border-blue-600"
                     >
                        <CardHeader className="pb-4">
                           <CardTitle className="flex items-center text-xl text-gray-800">
                              <User className="h-5 w-5 mr-2 text-blue-600" />
                              {worker.name}
                           </CardTitle>
                           <p className="text-sm text-gray-500 flex items-center mt-1">
                              <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                              {worker.qualification}
                           </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div className="flex items-center text-gray-600">
                              <Calendar className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                              <p>Age: {worker.age}</p>
                           </div>
                           <div className="flex items-center text-gray-600">
                              <Phone className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                              <p>{worker.contact_number}</p>
                           </div>
                           <div className="flex items-start text-gray-600">
                              <MapPin className="h-5 w-5 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                              <p className="line-clamp-2">{worker.city}, {worker.state}</p>
                           </div>
                           <div className="flex items-center text-gray-600">
                              <Mail className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                              <p className="truncate">{worker.email}</p>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default WorkerDashboard;