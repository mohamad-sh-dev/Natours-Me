const mongoose = require("mongoose")


const connection = async () => {
  
    try {

        const conn = await mongoose.connect(process.env.URI,{

           useFindAndModify:false,
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log(`Mongodb connected ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connection