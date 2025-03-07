import {
   createApi,
   fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import {
   userLoggedIn,
   userLoggedOut
} from '../authSlice';

const USER_API = 'http://localhost:8000/';

export const authApi = createApi({
   reducerPath: 'authApi',
   baseQuery: fetchBaseQuery({
      baseUrl: USER_API,
      credentials: 'include',
   }),
   endpoints: (builder) => ({
      loginUser: builder.mutation({
         query: (body) => ({
            url: 'api/users/login',
            method: 'POST',
            body,
         }),
         async onQueryStarted(arg, {
            queryFulfilled,
            dispatch
         }) {
            try {
               const result = await queryFulfilled;
               dispatch(userLoggedIn({
                  user: result.data.user
               }));
            } catch (e) {
               console.log(e);
            }
         }
      }),
      logout: builder.mutation({
         query: () => ({
            url: "/api/users/logout",
            method: "POST",
            credentials: "include",
         }),
         async onQueryStarted(arg, {
            dispatch,
            queryFulfilled
         }) {
            try {
               await queryFulfilled;
               dispatch(userLoggedOut());
            } catch (error) {
               console.error("Logout failed:", error);
            }
         },
      }),
      addHospital: builder.mutation({
         query: (body) => ({
            url: 'api/users/addhospital',
            method: 'POST',
            body,
         }),
      }),
      addworker: builder.mutation({
         query: (body) => ({
            url: `api/hospital/addworker/${body.hospital_id}`,
            method: 'POST',
            body,
         }),
      }),
      getHospital: builder.query({
         query: () => `/api/users/hospitals`,
      }),
      getworker: builder.query({
         query: ({
            id
         }) => `/api/hospital/getworker/${id}`,
      }),
      searchHospitals: builder.query({
         query: (query) => `/api/users/search-hospital?query=${query}`,
      }),
      searchworker: builder.query({
         query: ({
            query,
            hospital_id
         }) => `/api/hospital/search-workers/${hospital_id}?query=${query}`,
      }),
      addVaccineRecord: builder.mutation({
         query: (vaccineData) => ({
            url: '/api/hospital/add-child-vaccine',
            method: 'POST',
            body: vaccineData,
         }),
      }),

      // Get All Children from a Hospital
      getChildrenByHospital: builder.query({
         query: (hospital_id) => `/api/hospital/getchild/${hospital_id}`,
      }),

      // Search for a Child in a Hospital
      searchChild: builder.query({
         query: ({ hospital_id, startDate, endDate }) => ({
           url: `/api/hospital/search-child/${hospital_id}`,
           params: { start_date: startDate, end_date: endDate }
         }),
       }),

      // Upload Vaccine Certificate
      uploadCertificate: builder.mutation({
         query: (file) => {
            const formData = new FormData();
            formData.append("file", file);

            return {
               url: "/api/hospital/upload-certificate",
               method: "POST",
               body: formData,
               formData: true,
            };
         },
      }),

      getAllVaccines: builder.query({
         query: () => '/api/hospital/all-vaccine', // Fetch vaccines
      }),
      getAdminDeshboard: builder.query({
         query: () => '/api/deshboard/admin', 
      }),
      searchUser: builder.query({
         query: (query) => `/api/deshboard/search-workers?query=${query}`,
      }),
      searchHospital: builder.query({
         query: (query) => `/api/deshboard/search-hospital?query=${query}`,
      }),
      searchWorkerInHospital: builder.query({
         query: ({query,id}) => `/api/deshboard/search-workers/${id}?query=${query}`,
      }),
      getHospitalDeshboard: builder.query({
         query: (id) => `/api/deshboard/hospital/${id}`,
      }),
   })
});

export const {
   useLoginUserMutation,
   useGetHospitalQuery,
   useAddHospitalMutation,
   useSearchHospitalsQuery,
   useLogoutMutation,
   useAddworkerMutation,
   useGetworkerQuery,
   useSearchworkerQuery,
   useAddVaccineRecordMutation,
   useGetChildrenByHospitalQuery,
   useSearchChildQuery,
   useUploadCertificateMutation,
   useGetAllVaccinesQuery,
   useGetAdminDeshboardQuery,
   useSearchUserQuery,
   useSearchHospitalQuery,
   useGetHospitalDeshboardQuery,
   useSearchWorkerInHospitalQuery
} = authApi;