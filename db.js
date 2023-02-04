const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/tictactoe?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
const mongoURI = "mongodb+srv://Sameer:beZdmx5TeDMLDV5@cluster0.rubvk.mongodb.net/students?retryWrites=true&w=majority";
const connetToMongo =async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true },()=>{
        console.log("connect to Mongodb")
    })
}
module.exports = connetToMongo;