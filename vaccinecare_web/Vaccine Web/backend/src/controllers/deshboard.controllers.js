import supabase from '../connection/db.js';




export const getAllForAdmin = async (req, res) => {
   try {
      // Fetch hospitals data (removed "id" column if it doesn't exist)
      const {
         data: hospitals,
         error: hospitalError
      } = await supabase
         .from("hospitals")
         .select("name, city, state, address");

      // Fetch workers data with hospital details populated
      const {
         data: workers,
         error: workerError
      } = await supabase
         .from("workers")
         .select("name, age, qualification, contact_number, city, state, hospital:hospital_id(name, city, state)");

      // Fetch vaccination records data
      const {
         data: vaccine_records,
         error: vaccineError
      } = await supabase
         .from("vaccination_records")
         .select("*");

      // Handle any potential errors
      if (hospitalError || workerError || vaccineError) {
         return res.status(400).json({
            error: hospitalError?.message || workerError?.message || vaccineError?.message
         });
      }

      // Extract hospital names along with city and state
      const hospitals_list = hospitals?.map(hospital => ({
         name: hospital.name,
         city: hospital.city,
         state: hospital.state
      })) || [];

      // Extract workers list with populated hospital details
      const workers_list = workers?.map(worker => ({
         name: worker.name,
         age: worker.age,
         qualification: worker.qualification,
         contact_number: worker.contact_number,
         city: worker.city,
         state: worker.state,
         hospital_name: worker.hospital?.name || "Unknown",
         hospital_city: worker.hospital?.city || "Unknown",
         hospital_state: worker.hospital?.state || "Unknown"
      })) || [];

      // Return response with counts and lists
      res.status(200).json({
         hospitals_count: hospitals?.length || 0,
         workers_count: workers?.length || 0,
         vaccine_records_count: vaccine_records?.length || 0,
         hospitals_list,
         workers_list
      });

   } catch (err) {
      console.error("Error fetching admin data:", err);
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};



export const searchUser = async (req, res) => {
   try {
      const {
         query
      } = req.query; // Example: ?query=rajan

      if (!query) {
         return res.status(400).json({
            error: "Search query is required"
         });
      }

      const {
         data: workers,
         error
      } = await supabase
         .from("workers")
         .select("name, age, qualification, contact_number, city, state, hospital:hospital_id(name, city, state)")
         .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`);

      if (error) {
         return res.status(400).json({
            error: error.message
         });
      }

      const workers_list = workers?.map(worker => ({
         name: worker.name,
         age: worker.age,
         qualification: worker.qualification,
         contact_number: worker.contact_number,
         city: worker.city,
         state: worker.state,
         hospital_name: worker.hospital?.name || "Unknown",
         hospital_city: worker.hospital?.city || "Unknown",
         hospital_state: worker.hospital?.state || "Unknown"
      })) || [];

      res.status(200).json({
         workers_list
      });
   } catch (err) {
      console.error("Error searching users:", err);
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};


// ✅ Search Hospital by Name, City, or State
export const searchHospital = async (req, res) => {
   try {
      const {
         query
      } = req.query; // Example: ?query=surat

      if (!query) {
         return res.status(400).json({
            error: "Search query is required"
         });
      }

      const {
         data: hospitals,
         error
      } = await supabase
         .from("hospitals")
         .select("*")
         .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`);

      if (error) {
         return res.status(400).json({
            error: error.message
         });
      }

      const hospitals_list = hospitals?.map(hospital => ({
         name: hospital.name,
         city: hospital.city,
         state: hospital.state
      })) || [];

      res.status(200).json({
         hospitals_list
      });
   } catch (err) {
      console.error("Error searching hospitals:", err);
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};


export const getAllForHospital = async (req, res) => {
   try {
      const { id } = req.params; 

      // Fetch workers for the given hospital
      const { data: workers, error: workerError } = await supabase
         .from("workers")
         .select("name,email, age, qualification, contact_number, city, state, hospital:hospital_id(name, city, state)")
         .eq("hospital_id", id);

      // Fetch total vaccination records for the given hospital
      const { count: vaccine_records_count, error: vaccineError } = await supabase
         .from("vaccination_records")
         .select("*", { count: "exact" }) // Get count only
         .eq("hospital_id", id);

      // Handle any potential errors
      if (workerError || vaccineError) {
         return res.status(400).json({
            error: workerError?.message || vaccineError?.message
         });
      }

      // Format workers list with hospital details
      const workers_list = workers?.map(worker => ({
         name: worker.name,
         age: worker.age,
         qualification: worker.qualification,
         contact_number: worker.contact_number,
         city: worker.city,
         email: worker.email,
         state: worker.state,
         hospital_name: worker.hospital?.name || "Unknown",
         hospital_city: worker.hospital?.city || "Unknown",
         hospital_state: worker.hospital?.state || "Unknown"
      })) || [];

      res.status(200).json({
         workers_count: workers?.length || 0,
         vaccine_records_count: vaccine_records_count || 0,
         workers_list
      });

   } catch (err) {
      console.error("Error getting workers for hospital:", err);
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};


export const searchWorkerInHospital = async (req, res) => {
   try {
      const { id } = req.params; 
      const { query } = req.query; 

      if (!query) {
         return res.status(400).json({ error: "Search query is required" });
      }

      const { data: workers, error: workerError } = await supabase
         .from("workers")
         .select("name, age, qualification, contact_number, city, state")
         .eq("hospital_id", id)
         .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`);

      console.log(workers);
      
     
      // Handle potential errors
      if (workerError ) {
         return res.status(400).json({
            error: workerError?.message
         });
      }


      res.status(200).json({
         workers_list:workers
      });

   } catch (err) {
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};


