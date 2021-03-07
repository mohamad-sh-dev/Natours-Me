// Biuld Login Functionality (connect Front To Back-end) 
import axios from "axios"
import {showAlert} from "./alerts"


export const login = async (email, password) => {
    // use our api to login users 
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/Login',
            data: {
                email,
                password
            }
        })
        // if email or password Correct
        if (res.data.status === "success") {
            showAlert("success","Logged in successfuly!")
            window.setTimeout(() => {
                location.assign("/")
            }, 1500)
        }
        //if not correct 
    } catch (err) {

        showAlert("error",err.response.data.message);

    }
}

// connect to backend(our Api) with an http request (axios)
export const logout = async()=>{
    try {
        const res = await axios({
            method:"GET",
            url:'http://localhost:3000/api/v1/users/logout' //logout route exist in our api 
        })
        if(res.data.status==="success"){
           location.assign('/')    
        }
        
    } catch (err) {
        showAlert("error","Error")
    }
}
