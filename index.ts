import app from './src/app'

import "dotenv/config";



const PORT = process.env.PORT || 5001





app.listen(PORT,()=>{
    console.log("app is listening at ",PORT)
})