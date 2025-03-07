import bcrypt from 'bcryptjs';
import supabase from '../connection/db.js';
import jwt from 'jsonwebtoken';

export const createAdminUser = async (req, res) => {
   try {

      const { name, email, password, phone_number } = req.body;

      if (!name || !email || !password || !phone_number) {
         return res.status(400).json({ error: "All fields (name, email, password, phone_number) are required" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const { data, error } = await supabase
         .from('users')
         .insert([{
            name,
            email,
            password_hash: hashedPassword,
            phone_number,
            Role: 'admin'
         }])
         .select();

      if (error) {
         return res.status(500).json({ error: error.message });
      }

      res.status(201).json({ message: "Admin created successfully", data });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};


export const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      // Validate Input
      if (!email || !password) {
         return res.status(400).json({ error: "Email and password are required" });
      }
      
      
      // Fetch User from Database
      const { data, error } = await supabase
         .from("users")
         .select("*")
         .eq("email", email);

      if (error || !data || data.length === 0) {
         return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = data[0];

      // Compare Password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
         return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
         expiresIn: "1y",
      });

      // Set Cookie in Response
      res.cookie("token", token, {
         httpOnly: true,      // Prevents JavaScript access (for security)
         secure: process.env.NODE_ENV === "production", // Use Secure Cookie in production
         sameSite: "strict",  // CSRF Protection
         maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year expiry
      });

      // Send Response with User Data
      res.status(200).json({
         message: "Login successful",
         user: user
      });

   } catch (err) {
      res.status(500).json({ error: "Internal server error" });
   }
};

export const logout = async (req, res) => {
   try {
      // Clear the authentication cookie
      res.cookie("token", "", {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         expires: new Date(0), // Expire the cookie immediately
      });

      res.status(200).json({ message: "Logout successful" });

   } catch (err) {
      res.status(500).json({ error: "Internal server error" });
   }
};


export const getHospitals = async (req, res) => {
   try {
      console.log("data");
      const { data, error } = await supabase
         .from('hospitals')
         .select('*');

      
      if (error) {
         return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ data });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}


export const addHospital = async (req, res) => {
   try {
      const { name, address, city, contact_number, state, email,password } = req.body;

      // Validation: Check if all fields are provided
      if (!name || !address || !city || !contact_number || !state || !email) {
         return res.status(400).json({ error: "All fields are required." });
      }

      // Insert into Supabase
      const { data, error } = await supabase
         .from("hospitals")
         .insert([{ name, address, city, contact_number, state, email }])
         .select("*");

      
      // Handle Supabase errors
      if (error) {
         return res.status(500).json({ error: error.message });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const {data:data1 , error:err} = await supabase
         .from("users")
         .insert([{name,email,Role:'hospitals',phone_number:contact_number , password_hash:hashedPassword , hospital_id:data[0].hospital_id}])
         .select("*");

      if (err) {
         return res.status(500).json({ error: err.message });
      }
      
      
      // Success response
      res.status(201).json({ message: "Hospital added successfully", data });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};


export const searchHospitals = async (req, res) => {
   try {
      const { query } = req.query;

      if (!query) {
         return res.status(400).json({ error: "Search query is required." });
      }

      const { data, error } = await supabase
         .from("hospitals")
         .select("*")
         .or(`name.ilike.%${query}%,email.ilike.%${query}%`);

      if (error) {
         return res.status(500).json({ error: error.message });
      }

      res.json({ data });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}