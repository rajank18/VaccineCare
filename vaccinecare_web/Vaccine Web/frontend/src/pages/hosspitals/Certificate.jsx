import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useAddVaccineRecordMutation,
  useGetChildrenByHospitalQuery,
  useSearchChildQuery,
  useUploadCertificateMutation,
  useGetAllVaccinesQuery,
} from "@/features/api/authApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  PlusCircle,
  Calendar,
  Upload,
  FileText,
  Baby,
  Syringe,
  Search,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import debounce from "lodash/debounce";
import Navigation from "../Navigation";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Certificate = () => {
  const user = useSelector((state) => state.auth.user);
  const hospital_id = user?.hospital_id || user?.worker_id;
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    vaccine_id: "",
    dose_number: "",
    date_administered: format(new Date(), "yyyy-MM-dd"),
    administered_by: user?.user_id,
    certificate_url: "",
    hospital_id: hospital_id
  });

  const { data: vaccines } = useGetAllVaccinesQuery();
  const { data: children, isLoading, refetch: childRefetch } = useGetChildrenByHospitalQuery(hospital_id);
  const [addVaccineRecord] = useAddVaccineRecordMutation();
  const [uploadCertificate] = useUploadCertificateMutation();

  const { data: searchResults, isLoading: isSearching, refetch } = useSearchChildQuery(
    {
      hospital_id: user.user_id,
      startDate,
      endDate
    },
    {
      skip: !hospital_id || !startDate || !endDate,
    }
  );

  useEffect(() => {
    if (startDate && endDate && hospital_id) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        toast.error("Invalid date range", {
          description: "Start date must be before end date"
        });
        setEndDate("");
        return;
      }
      refetch();
    }
  }, [startDate, endDate, hospital_id]);

  const displayedChildren = useMemo(() => {
    if (startDate && endDate && searchResults?.vaccinated_children) {
      return searchResults.vaccinated_children;
    }
    return children?.vaccinated_children || [];
  }, [startDate, endDate, searchResults, children]);

  const handleDateChange = (setter) => (date) => {
    setter(format(date, "yyyy-MM-dd"));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    try {
      const formData = new FormData();
      formData.append('certificate', selectedFile);
      setUploadProgress(30);
      const response = await uploadCertificate(selectedFile).unwrap();
      setUploadProgress(100);
      setCertificateUrl(response.file_url);
      setFormData(prev => ({ ...prev, certificate_url: response.file_url }));
      
      toast.success("Certificate uploaded", {
        description: "Certificate has been uploaded successfully"
      });
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadProgress(0);
      toast.error("Upload failed", {
        description: "Failed to upload certificate. Please try again."
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVaccineRecord({
        ...formData,
        hospital_id,
      }).unwrap();
      
      toast.success("Record added successfully", {
        description: `Vaccination record for ${formData.name} has been added.`
      });
      
      setDialogOpen(false);
      setFormData({
        name: "",
        birthdate: "",
        vaccine_id: "",
        dose_number: "",
        date_administered: format(new Date(), "yyyy-MM-dd"),
        administered_by: user?.name || "",
        certificate_url: "",
        hospital_id: hospital_id
      });
      setCertificateUrl("");
      setSelectedFile(null);
      childRefetch();
    } catch (error) {
      console.error("Failed to add vaccine record:", error);
      toast.error("Failed to add record", {
        description: error.data?.message || "Something went wrong. Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen animated-bg smooth-scroll page-transition">
      <Navigation />
      <Toaster position="top-right" richColors />
      
      <div className="container mx-auto p-6 space-y-8">
        <div className="glass-effect rounded-2xl   stagger-animation">
          <div className="flex flex-col bg-blue-500 p-8 rounded-xl md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white float-icon mb-2">
                Vaccination Certificates
              </h1>
              <p className="text-gray-300">
                Manage and track vaccination records efficiently
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="date-picker">
                  <Label className="text-sm font-medium text-white">Start Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-10 input-focus"
                      max={endDate || undefined}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="date-picker">
                  <Label className="text-sm font-medium text-white">End Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-10 input-focus"
                      min={startDate || undefined}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {startDate && endDate && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="self-end button-hover"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white button-hover">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Vaccine Record
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[525px] ">
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Add Vaccine Record
                    </h2>
                    <DialogDescription className="text-gray-500 mt-1">
                      Enter the vaccination details below
                    </DialogDescription>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Child's Name</Label>
                      <div className="relative">
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 input-focus"
                          required
                        />
                        <Baby className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 float-icon" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Birth Date</Label>
                        <div className="relative">
                          <Input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            className="pl-10 input-focus"
                            required
                          />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Vaccine</Label>
                        <Select
                          name="vaccine_id"
                          value={formData.vaccine_id || ""}
                          onValueChange={(value) => {
                            setFormData((prev) => ({ ...prev, vaccine_id: value }));
                          }}
                        >
                          <SelectTrigger className="input-focus">
                            <SelectValue placeholder="Select vaccine" />
                          </SelectTrigger>
                          <SelectContent>
                            {vaccines?.vaccines?.length > 0 ? (
                              vaccines.vaccines.map((vaccine) => (
                                <SelectItem key={vaccine.vaccine_id} value={String(vaccine.vaccine_id)}>
                                  {vaccine.name}
                                </SelectItem>
                              ))
                            ) : (
                              <p className="p-2 text-sm text-gray-500">No vaccines available</p>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Dose Number</Label>
                        <Input
                          type="number"
                          name="dose_number"
                          value={formData.dose_number}
                          onChange={handleChange}
                          min="1"
                          className="input-focus"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Date Administered</Label>
                        <Input
                          type="date"
                          name="date_administered"
                          value={formData.date_administered}
                          onChange={handleChange}
                          className="input-focus"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Certificate Upload</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          id="certificate"
                          accept="image/*,.pdf"
                          name="certificate"
                        />
                        <label
                          htmlFor="certificate"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2 float-icon" />
                          <span className="text-sm text-gray-500">
                            {selectedFile ? selectedFile.name : "Click to upload certificate"}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            Supported formats: Images, PDF
                          </span>
                        </label>
                      </div>

                      {uploadProgress > 0 && (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-sm text-gray-500 text-center">
                            {uploadProgress === 100 ? "Upload complete!" : "Uploading..."}
                          </p>
                        </div>
                      )}

                      {selectedFile && uploadProgress === 0 && (
                        <Button
                          type="button"
                          onClick={handleFileUpload}
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 button-hover"
                          variant="outline"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Certificate
                        </Button>
                      )}

                      {certificateUrl && (
                        <div className="mt-2 p-3 bg-green-50 rounded-md">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-600">Upload successful!</span>
                            <a
                              href={certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 certificate-link"
                            >
                              View <FileText className="w-4 h-4 ml-1 inline" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        className="hover:bg-gray-100 button-hover"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white button-hover"
                        disabled={!certificateUrl}
                      >
                        Add Record
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="mt-8 stagger-animation" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {searchQuery ? 'Search Results' : 'Vaccination Records'}
          </h2>

          {(isLoading || isSearching) && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 loading-pulse" />
            </div>
          )}

          {!isLoading && !displayedChildren?.length && (
            <div className="text-center py-12 bg-gray-50 rounded-lg glass-effect">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4 float-icon" />
              <p className="text-gray-600 text-lg">No vaccination records found</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 card-grid  ">
            {displayedChildren?.map((record, index) => (
              <div
                key={index}
                className="stagger-animation "
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="card-hover glass-effect">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                        <Baby className="h-6 w-6 mr-2 text-blue-600 float-icon" />
                        {record.baby_name}
                      </CardTitle>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium status-badge">
                        Dose {record.dose_number}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Born: {format(new Date(record.baby_birthdate), "MMMM d, yyyy")}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <Syringe className="h-5 w-5 mr-2 text-gray-500 float-icon" />
                      <p className="font-medium">{record.vaccine_name}</p>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500 float-icon" />
                      <p className="font-medium">
                        {format(new Date(record.date_administered), "MMMM d, yyyy")}
                      </p>
                    </div>
                    {record.certificate_url && (
                      <a
                        href={record.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium p-3 bg-blue-50 rounded-lg hover:bg-blue-100 certificate-link"
                      >
                        <FileText className="h-5 w-5 mr-2 float-icon" />
                        View Certificate
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;