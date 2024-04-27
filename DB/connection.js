import mongoose from "mongoose";
const connectDB = async() =>{
    mongoose.connect(process.env.DB)
    .then(()=>{
        console.log("connection DONE");
    }).catch((err) => {
        console.log(`Error connecting ${err}`);
})
}
export default connectDB