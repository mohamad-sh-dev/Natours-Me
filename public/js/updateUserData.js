import axios from "axios"
import {
    showAlert
} from "./alerts"

// Build A function for updata user password and user data (name,email)
export const updateUserData = async (data, type) => {
    try {
        // create url depend on type (password or data(name,email))
        const url = type === 'password' ? "http://localhost:3000/api/v1/users/updatemyPassword"
         : "http://localhost:3000/api/v1/users/UpdateMe"
        const user = await axios({
            method: "patch",
            url: url,
            data // send data who can be password or data(name,email)

        })
        //send response if its success
        if (user.data.status === "success") {
            showAlert("success", `${type.toUpperCase()} Updated`)
            window.setTimeout(()=>{
                location.reload(true)
            },1500)
           
        }
        // show error messages (exist in our api route!)
    } catch (err) {
        showAlert("error", err.response.data.message)
    }

}