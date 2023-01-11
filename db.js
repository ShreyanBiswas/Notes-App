const mongoose = require('mongoose')
const mongoURI = "mongodb+srv://Shreyan:2010shreyan@cluster0.3fkyqpq.mongodb.net/iNotebook"
mongoose.set('strictQuery', true);
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo;