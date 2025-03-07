import React, { useState, useEffect } from 'react';
import { useGetAdminDeshboardQuery, useSearchUserQuery, useSearchHospitalQuery } from '@/features/api/authApi';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
   Hospital,
   Users,
   Syringe,
   Search,
   MapPin,
   Phone,
   GraduationCap,
   Loader2,
   Calendar,
   Building
} from 'lucide-react';
import Navigation from '../Navigation';
import debounce from 'lodash/debounce';

const Dashboard = () => {
   const [workerSearchQuery, setWorkerSearchQuery] = useState('');
   const [hospitalSearchQuery, setHospitalSearchQuery] = useState('');

   // Main dashboard data
   const {
      data: dashboardData,
      isLoading: isDashboardLoading,
      refetch: refetchDashboard
   } = useGetAdminDeshboardQuery();

   // Search queries
   const { data: searchedWorkersData, isLoading: isSearchingWorkers } = useSearchUserQuery(
      workerSearchQuery,
      { skip: !workerSearchQuery }
   );

   const { data: searchedHospitalsData, isLoading: isSearchingHospitals } = useSearchHospitalQuery(
      hospitalSearchQuery,
      { skip: !hospitalSearchQuery }
   );

   // Determine which data to display
   const hospitalsList = hospitalSearchQuery ?
      searchedHospitalsData?.hospitals_list :
      dashboardData?.hospitals_list;

   const workersList = workerSearchQuery ?
      searchedWorkersData?.workers_list :
      dashboardData?.workers_list;

   // Debounced search functions
   const debouncedWorkerSearch = debounce((value) => {
      setWorkerSearchQuery(value);
      if (!value) refetchDashboard();
   }, 300);

   const debouncedHospitalSearch = debounce((value) => {
      setHospitalSearchQuery(value);
      if (!value) refetchDashboard();
   }, 300);

   // Cleanup debounce on unmount
   useEffect(() => {
      return () => {
         debouncedWorkerSearch.cancel();
         debouncedHospitalSearch.cancel();
      };
   }, []);

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
         <Navigation />
         <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div>
               <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
               <p className="text-gray-600 mt-2">Overview of your healthcare system</p>
            </div>

            {/* Statistics Cards */}
            {isDashboardLoading ? (
               <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stats cards remain the same */}
                  <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600">Total Hospitals</CardTitle>
                        <Hospital className="h-5 w-5 text-blue-600" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-3xl font-bold text-blue-700">{dashboardData?.hospitals_count || 0}</div>
                        <p className="text-sm text-blue-600 mt-1">Registered facilities</p>
                     </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-white">
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-green-600">Healthcare Workers</CardTitle>
                        <Users className="h-5 w-5 text-green-600" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-3xl font-bold text-green-700">{dashboardData?.workers_count || 0}</div>
                        <p className="text-sm text-green-600 mt-1">Active personnel</p>
                     </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-white">
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-purple-600">Vaccination Records</CardTitle>
                        <Syringe className="h-5 w-5 text-purple-600" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-3xl font-bold text-purple-700">{dashboardData?.vaccine_records_count || 0}</div>
                        <p className="text-sm text-purple-600 mt-1">Total vaccinations</p>
                     </CardContent>
                  </Card>
               </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Hospitals Section */}
               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Hospital className="h-5 w-5 mr-2 text-blue-600" />
                        Hospitals
                     </h2>
                     <div className="relative w-64">
                        <Input
                           type="text"
                           placeholder="Search hospitals..."
                           className="pl-10 pr-4 py-2"
                           onChange={(e) => debouncedHospitalSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     {isSearchingHospitals || (hospitalSearchQuery && isDashboardLoading) ? (
                        <div className="flex justify-center py-8">
                           <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                     ) : hospitalsList?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                           <Hospital className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                           <p>No hospitals found</p>
                        </div>
                     ) : (
                        hospitalsList?.map((hospital, index) => (
                           <Card key={index} className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                 <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg text-gray-800">{hospital.name}</h3>
                                 </div>
                                 <div className="flex items-center mt-2 text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>{hospital.city}, {hospital.state}</span>
                                 </div>
                              </CardContent>
                           </Card>
                        ))
                     )}
                  </div>
               </div>

               {/* Healthcare Workers Section */}
               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-green-600" />
                        Healthcare Workers
                     </h2>
                     <div className="relative w-64">
                        <Input
                           type="text"
                           placeholder="Search workers..."
                           className="pl-10 pr-4 py-2"
                           onChange={(e) => debouncedWorkerSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     {isSearchingWorkers || (workerSearchQuery && isDashboardLoading) ? (
                        <div className="flex justify-center py-8">
                           <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        </div>
                     ) : workersList?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                           <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                           <p>No workers found</p>
                        </div>
                     ) : (
                        workersList?.map((worker, index) => (
                           <Card key={index} className="hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500">
                              <CardContent className="p-4">
                                 <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-lg text-gray-800">{worker.name}</h3>
                                 </div>

                                 <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center text-gray-600">
                                       <Calendar className="h-4 w-4 mr-2 text-green-500" />
                                       <span>Age: {worker.age}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                       <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                                       <span>{worker.qualification}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                       <Phone className="h-4 w-4 mr-2 text-green-500" />
                                       <span>{worker.contact_number}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                       <MapPin className="h-4 w-4 mr-2 text-green-500" />
                                       <span>{worker.city}, {worker.state}</span>
                                    </div>
                                 </div>

                                 <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-start">
                                       <Building className="h-4 w-4 mr-2 mt-1 text-blue-500" />
                                       <div>
                                          <p className="font-medium text-gray-700">{worker.hospital_name}</p>
                                          <p className="text-sm text-gray-600">{worker.hospital_city}, {worker.hospital_state}</p>
                                       </div>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        ))
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;

