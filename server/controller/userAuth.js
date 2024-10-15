import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/genrateToken.js";

// Regex patterns for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
const nameRegex = /^[a-zA-Z\s]{2,30}$/; // Name should be 2 to 30 characters long and only contain letters and spaces
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const userRegister = async (req, res) => {
    try {
        const { name, userEmail, password } = req.body;

        // Validate input fields
        if (!name || !userEmail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate name
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: "Name must be 2-30 characters long and contain only letters and spaces." });
        }

        // Validate email
        if (!emailRegex.test(userEmail)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Validate password
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number." });
        }

        // Check if user already exists
        const userExist = await userModel.findOne({ userEmail });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            userEmail,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Registration error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// User Login
const userLogin = async (req, res) => {
    try {
        const { userEmail, password } = req.body;

        // Validate input fields
        if (!userEmail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user by email
        const user = await userModel.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const token = generateToken(user._id);

        return res.json({
            _id: user._id,
            name: user.name,
            //phone: user.userPhone,
            email: user.userEmail,
           
            token,
          });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


//mark add 

const usersTotalMark = async (req, res) => {
  const { id } = req.params; // Extract user ID from request parameters

  try {
    console.log(req.body,"tyuio");
    
    const { totalMark, options } = req.body; // Extract totalMark and options from request body
    console.log(options); // Log the options for debugging

    // Use findByIdAndUpdate to update the user's totalMark and options
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { totalMark, options }, // Combine totalMark and options in the update object
      { new: true } // Return the updated document
    );
console.log(totalMark);

    if (!updatedUser) {
      // If user is not found, send a 404 response
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user object and success message
    return res.status(200).json({
      message: 'User total mark updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user total mark:', error);

    // If there's an error, return a 500 response with an error message
    return res.status(500).json({ message: 'Error updating user total mark' });
  }
};
  

export { userRegister, userLogin,usersTotalMark };