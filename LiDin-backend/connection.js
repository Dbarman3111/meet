const  mongoose = require('mongoose')


// Linked@03

//  mongodb+srv://linkedin_03_clone:<db_password>@cluster0.8mcgkwn.mongodb.net/<dbname>?retryWrites=true&w=majority

mongoose.connect('mongodb+srv://linkedin_03_clone:Linked%4003@cluster0.8mcgkwn.mongodb.net/linkedinDB?retryWrites=true&w=majority')
  .then(() => {
    console.log("✅ MongoDB connected Successfully")
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message || err)
  })