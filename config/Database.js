const mongoose = require("mongoose")

const DB = process.env.DATABSE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
const connection = async () => {
  
    try {

        const conn = await mongoose.connect(DB,{

           useFindAndModify:false,
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log('Mongodb connected to database ');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connection