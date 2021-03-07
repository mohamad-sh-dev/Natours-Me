import "@babel/polyfill"
import {
    login,
    logout
} from "./login"
import {
    displayMap
} from "./script"
import {
    updateUserData
} from "./updateUserData"

const mapBox = document.getElementById('map')
const loginForm = document.querySelector(".form--login")
const logOutBtn = document.querySelector(".nav__el--logout")
const updateUser = document.querySelector(".form-user-data")
const updateUserPassword = document.querySelector(".form-user-settings")

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.location)
    displayMap(locations)
}
// if element does exists
if (loginForm) {
    loginForm.addEventListener("submit", el => {
        el.preventDefault()
        //get values of our website inputes and set to variables(name,password)
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        //send to our backend for login (API)
        login(email, password)
    })
}
//add eventListener to logout bottom
if (logOutBtn) logOutBtn.addEventListener("click", logout)

// update user data(email,name) and set type to "data"
if (updateUser) {
    updateUser.addEventListener("submit", el => {
        el.preventDefault()
        //get values of our website inputes and set to variables(name,email)
        const form = new FormData()
        form.append("name",document.getElementById("name").value)
        form.append("email",document.getElementById("email").value)
        form.append("photo",document.getElementById("photo").files[0])
        // send values to our backend(API)
        updateUserData(form ,"data")

    })
}
// update user password (get element on web site and set to variables) and set type ("password" or "data"(name,email))
if (updateUserPassword) {
    updateUserPassword.addEventListener("submit", async el => {
        el.preventDefault()
        
        document.querySelector(".btn--save-password").textContent = "Updating" // to figurout our data in updating cycle !
        //get values of our website inputs to send to our backend (API)
        const currentPassword = document.getElementById("password-current").value
        const password = document.getElementById("password").value
        const passwordConfirm = document.getElementById("password-confirm").value
        // send values to our backend (API)
        await updateUserData({
            currentPassword,
            password,
            passwordConfirm
        }, 'password')
        // when is success set values of inputs to null and botton to save password  
         document.querySelector(".btn--save-password").textContent = "Save Password"
         document.getElementById("password-current").value = ""
         document.getElementById("password").value = ""
         document.getElementById("password-confirm").value = ""
    })

}