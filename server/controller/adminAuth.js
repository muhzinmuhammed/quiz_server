//admin login

import userModel from "../models/userModel.js"


const adminLogin=async(req,res)=>{
    try {
        const adminEmail="admin2024@gmail.com"
        const adminPassword="Passw$123"
        const {email,password}=req.body
        if (adminEmail==email&&adminPassword==password) {
            return res.status(200).json({message:'Adminlogin success'})
            
        }
        else{
            return res.status(200).json({message:'Adminlogin success'})
        }
        
    } catch (error) {
        console.log(error);
        
        
    }
}


const adminDashBoard=async(req,res)=>{
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        // Create a search filter (case-insensitive) for the user name
        const searchQuery = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        // Get total count of users for pagination
        const totalUsers = await userModel.countDocuments(searchQuery);

        // Fetch users based on pagination and search filters
        const usersData = await userModel
            .find(searchQuery)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .exec();

        if (usersData) {
            return res.status(200).json({
                data: usersData,
                currentPage: Number(page),
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers: totalUsers
            });
        } else {
            return res.status(400).json({ message: "No Data" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" });
    }
}
export {adminLogin,adminDashBoard}