import mongoose from "mongoose";
 const adminSchema = new mongoose.Schema({  
    name: {  
        type: String,  
        required: true,  
        trim: true  
    },
    email: {  
        type: String,  
        required: true,  
        trim: true  
    },
    password: {  
        type: String,  
        required: true,  
        trim: true  
    },
    upiid: {  
        type: String,  
        required: true,  
        trim: true  
    }
}); 
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;