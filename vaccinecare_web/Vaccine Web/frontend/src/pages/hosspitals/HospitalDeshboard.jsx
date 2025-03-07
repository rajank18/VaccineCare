import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useGetHospitalDeshboardQuery, useSearchWorkerInHospitalQuery } from '@/features/api/authApi';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Syringe,
  Search,
  Briefcase,
  Calendar,
  Phone,
  MapPin,
  Loader2,
  Building,
  Mail,
  GraduationCap
} from 'lucide-react';
import debounce from 'lodash/debounce';
import Navigation from '../Navigation';
import { motion } from 'framer-motion';

const HospitalDeshboard = () => {
  const user = useSelector((state) => state.auth.user);
  const hospital_id = user?.hospital_id;
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading,
    error: dashboardError 
  } = useGetHospitalDeshboardQuery(hospital_id);

  const { 
    data: searchResults,
    isLoading: isSearching 
  } = useSearchWorkerInHospitalQuery(
    { query: searchQuery, id: hospital_id },
    { skip: !searchQuery }
  );

  const displayedWorkers = searchQuery ? 
    searchResults?.workers_list : 
    dashboardData?.workers_list;

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navigation />
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hospital Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your hospital's operations</p>
        </div>

        {/* Statistics Cards */}
        {isDashboardLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Workers Stats */}
            <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">Healthcare Workers</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{dashboardData?.workers_count || 0}</div>
                <p className="text-sm text-blue-600 mt-1">Active personnel</p>
              </CardContent>
            </Card>

            {/* Vaccination Stats */}
            <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-600">Vaccination Records</CardTitle>
                <Syringe className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{dashboardData?.vaccine_records_count || 0}</div>
                <p className="text-sm text-green-600 mt-1">Total vaccinations</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Workers List Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Healthcare Workers
            </h2>
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search workers..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Loading State */}
            {(isDashboardLoading || isSearching) && (
              <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading workers...</p>
              </div>
            )}

            {/* Error State */}
            {dashboardError && (
              <div className="text-center py-8 bg-red-50 rounded-lg">
                <p className="text-red-600">Error loading dashboard data. Please try again.</p>
              </div>
            )}

            {/* Empty State */}
            {!isDashboardLoading && !isSearching && (!displayedWorkers || displayedWorkers.length === 0) && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No Workers Found
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? 'No workers match your search criteria' : 'No healthcare workers have been added yet'}
                </p>
              </div>
            )}

            {/* Workers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedWorkers?.map((worker, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1 rounded-2xl border-l-4 border-l-blue-500">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                          {worker.name}
                        </CardTitle>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                          Healthcare Worker
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center mt-2">
                        <GraduationCap className="h-4 w-4 mr-1 text-gray-400" />
                        {worker.qualification}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Age: {worker.age}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{worker.contact_number}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{worker.city}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{worker.email}</span>
                        </div>
                      </div>

                      {worker.hospital_name && (
                        <div className="pt-3 mt-3 border-t border-gray-100">
                          <div className="flex items-start">
                            <Building className="h-4 w-4 mr-2 mt-1 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-700">{worker.hospital_name}</p>
                              <p className="text-sm text-gray-600">{worker.hospital_city}, {worker.hospital_state}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDeshboard;
