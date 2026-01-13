import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const makeUserAdmin = async (username) => {
    try {
        await mongoose.connect("mongodb+srv://virtualmeet:Abhishek1@virtualmeet.0ixev2f.mongodb.net/");
        console.log("Connected to MongoDB");

        const user = await User.findOne({ username: username });
        
        if (!user) {
            console.log(`User with username "${username}" not found`);
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save();

        console.log(`✓ User "${username}" is now an admin!`);
        console.log(`User details:`, {
            name: user.name,
            username: user.username,
            isAdmin: user.isAdmin
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

const username = process.argv[2];

if (!username) {
    console.log("Usage: node makeAdmin.js <username>");
    console.log("Example: node makeAdmin.js john_doe");
    process.exit(1);
}

makeUserAdmin(username);
