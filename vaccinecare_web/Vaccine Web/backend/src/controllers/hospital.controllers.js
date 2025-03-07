import bcrypt from 'bcryptjs';
import supabase from '../connection/db.js';


export const addWorker = async (req, res) => {
   try {
      const {
         hospital_id
      } = req.params;
      const {
         name,
         qualification,
         age,
         contact_number,
         city,
         state,
         email,
         password
      } = req.body;


      if (!name || !age || !contact_number || !city || !state || !email || !password) {
         return res.status(400).json({
            error: "All fields are required."
         });
      }

      const {
         data: hospitalData,
         error: hospitalError
      } = await supabase
         .from("hospitals")
         .select("hospital_id")
         .eq("hospital_id", String(hospital_id))
         .single();

      if (hospitalError || !hospitalData) {
         return res.status(404).json({
            error: "Hospital not found."
         });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert Worker into `workers` Table
      const {
         data,
         error
      } = await supabase
         .from("workers")
         .insert([{
            name,
            email,
            age,
            contact_number,
            hospital_id,
            city,
            state,
            qualification
         }])
         .select("*");

      if (error) {
         return res.status(500).json({
            error: error.message
         });
      }

      console.log(data);

      // Add Worker as a User in `users` Table (for authentication)
      const {
         data: userData,
         error: userError
      } = await supabase
         .from("users")
         .insert([{
            name,
            email,
            Role: "healthcare_worker",
            phone_number: contact_number,
            password_hash: hashedPassword,
            worker_id: data[0].worker_id
         }])
         .select("*");

      if (userError) {
         return res.status(500).json({
            error: userError.message
         });
      }

      // Success response
      res.status(201).json({
         message: "Worker added successfully",
         worker: data,
         user: userData
      });
   } catch (err) {
      res.status(500).json({
         error: err.message
      });
   }
};


export const getAllWorkers = async (req, res) => {
   try {
      const {
         hospital_id
      } = req.params;

      // Validate hospital_id
      if (!hospital_id) {
         return res.status(400).json({
            error: "Hospital ID is required."
         });
      }

      // Fetch workers based on hospital_id
      const {
         data,
         error
      } = await supabase
         .from("workers")
         .select("*")
         .eq("hospital_id", hospital_id);

      if (error) {
         return res.status(500).json({
            error: error.message
         });
      }

      // If no workers found
      if (!data || data.length === 0) {
         return res.status(404).json({
            message: "No workers found for this hospital."
         });
      }

      // Success Response
      res.status(200).json({
         workers: data
      });
   } catch (err) {
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};


export const searchWorkers = async (req, res) => {
   try {
      const {
         hospital_id
      } = req.params;
      const {
         query
      } = req.query; // Search query from request

      console.log("Received hospital_id:", hospital_id);
      console.log("Received query:", query);

      // Validate input
      if (!hospital_id) {
         return res.status(400).json({
            error: "Hospital ID is required."
         });
      }
      if (!query) {
         return res.status(400).json({
            error: "Search query is required."
         });
      }

      // Corrected search query using `or`
      const {
         data,
         error
      } = await supabase
         .from("workers")
         .select("*")
         .eq("hospital_id", hospital_id)
         .or(`name.ilike.%${query}%,city.ilike.%${query}%,contact_number.ilike.%${query}%`);

      if (error) {
         console.error("Supabase Error:", error.message);
         return res.status(500).json({
            error: error.message
         });
      }

      // If no matching workers are found
      if (!data || data.length === 0) {
         return res.status(404).json({
            message: "No workers found matching the search criteria."
         });
      }

      // Success response
      res.status(200).json({
         workers: data
      });
   } catch (err) {
      console.error("Search Workers Route Error:", err);
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};





export const addVaccineRecord = async (req, res) => {
   try {

      const {
         name,
         birthdate,
         vaccine_id,
         dose_number,
         date_administered,
         hospital_id,
         administered_by,
         certificate_url
      } = req.body;

      console.log(req.body);

      if (!name || !birthdate || !vaccine_id || !dose_number || !date_administered || !hospital_id || !administered_by) {
         return res.status(400).json({
            error: "Missing required fields."
         });
      }

      // Find the baby by name and birthdate
      const {
         data: babyData,
         error: babyError
      } = await supabase
         .from("babies")
         .select("baby_id")
         .eq("name", name)
         .eq("birth_date", birthdate)
         .single();

      if (babyError || !babyData) {
         return res.status(404).json({
            error: "Baby not found."
         });
      }
      // console.log(babyData);


      const baby_id = babyData.baby_id; // Get the baby's ID

      // Insert new vaccine record
      const {
         data,
         error
      } = await supabase
         .from("vaccination_records")
         .insert([{
            baby_id,
            vaccine_id,
            dose_number,
            date_administered,
            hospital_id,
            administered_by,
            certificate_url,
         }]);

      console.log("harsh", data);

      if (error) {
         const {
            data,
            error
         } = await supabase
            .from("vaccination_records")
            .insert([{
               baby_id,
               vaccine_id,
               dose_number,
               date_administered,
               worker_id: hospital_id,
               administered_by,
               certificate_url,
            }]);
         if (error) {
            return res.status(500).json({
               error: error.message
            });

         }
      }

      res.status(201).json({
         message: "Vaccine record added successfully",
         record: data
      });
   } catch (err) {
      console.error("Error adding vaccine record:", err);
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};


export const getChildrenByHospital = async (req, res) => {
   try {
      const {
         hospital_id
      } = req.params;

      if (!hospital_id) {
         return res.status(400).json({
            error: "Hospital ID is required."
         });
      }

      const { data, error } = await supabase
   .from("vaccination_records")
   .select(`
      baby_id,
      vaccine_id,
      hospital_id,
      dose_number,
      date_administered,
      babies (name, birthplace, birth_date, gender),
      vaccines (name),
      certificate_url,
      worker_id
   `)
   .or(`hospital_id.eq.${hospital_id},worker_id.eq.${hospital_id}`);

      if (error) {
         return res.status(500).json({
            error: error.message
         });
      }

      if (!data || data.length === 0) {
         return res.status(404).json({
            message: "No vaccinated children found for this hospital."
         });
      }

      // Flattening the response
      const formattedData = data.map(record => ({
         baby_id: record.baby_id,
         baby_name: record.babies?.name,
         baby_birthdate: record.babies?.birth_date,
         baby_gender: record.babies?.gender,
         vaccine_id: record.vaccine_id,
         vaccine_name: record.vaccines?.name,
         dose_number: record.dose_number,
         date_administered: record.date_administered,
         hospital_id: record.hospital_id,
         birthplace: record.babies?.birthplace,
         certificate_url: record.certificate_url,
      }));

      res.status(200).json({
         vaccinated_children: formattedData
      });
   } catch (err) {
      console.error("Error fetching children:", err);
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};

export const filterChildrenByHospitalAndDate = async (req, res) => {
  try {
    const { hospital_id } = req.params;
    const { start_date, end_date } = req.query;



    if (!hospital_id) {
      return res.status(400).json({ error: "Hospital ID is required." });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({ error: "Both start_date and end_date are required." });
    }


    // Convert dates to ISO format
    const startDate = new Date(start_date).toISOString();
    const endDate = new Date(end_date).toISOString();

    const { data, error } = await supabase
      .from("vaccination_records")
      .select(`
        baby_id,
        vaccine_id,
        hospital_id,
        dose_number,
        date_administered,
        babies (name, birthplace, birth_date, gender),
        vaccines (name),
        certificate_url
      `)
      .or(`administered_by.eq.${hospital_id},worker_id.eq.${hospital_id}`)
      .gte("date_administered", startDate)
      .lte("date_administered", endDate);

      
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data?.length) {
      return res.status(404).json({
        message: "No vaccinated children found for the given hospital and date range."
      });
    }

    const formattedData = data.map(record => ({
      baby_id: record.baby_id,
      baby_name: record.babies?.name,
      baby_birthdate: record.babies?.birth_date,
      baby_gender: record.babies?.gender,
      vaccine_id: record.vaccine_id,
      vaccine_name: record.vaccines?.name,
      dose_number: record.dose_number,
      date_administered: record.date_administered,
      hospital_id: record.hospital_id,
      birthplace: record.babies?.birthplace,
      certificate_url: record.certificate_url
    }));

    

    return res.status(200).json({ vaccinated_children: formattedData });

  } catch (err) {
    console.error("Error filtering children:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



import multer from "multer";
import {
   uploadMedia
} from '../utils/cloudinary.js';
const upload = multer({
   dest: "uploads/"
}); // Temporary upload folder

export const uploadFile = async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({
            message: "Please upload a file."
         });
      }

      // Upload file to Cloudinary
      const uploadedFile = await uploadMedia(req.file.path);

      if (!uploadedFile || !uploadedFile.secure_url) {
         return res.status(500).json({
            message: "Failed to upload file."
         });
      }

      return res.status(200).json({
         message: "File uploaded successfully.",
         file_url: uploadedFile.secure_url,
      });

   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: "Server error while uploading file."
      });
   }
};



export const getAllVaccines = async (req, res) => {
   try {
      const {
         data,
         error
      } = await supabase.from('vaccines').select('*'); // Fetch all vaccine records

      if (error) {
         return res.status(500).json({
            error: error.message
         });
      }

      if (!data || data.length === 0) {
         return res.status(404).json({
            message: "No vaccines found."
         });
      }

      res.status(200).json({
         vaccines: data
      });

   } catch (err) {
      res.status(500).json({
         error: "Internal Server Error"
      });
   }
};