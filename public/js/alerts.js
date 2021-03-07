//Function => Hide Alert If Exist 
export const hideAlert = ()=>{
    const el = document.querySelector(".alert")
    if (el) el.parentElement.removeChild(el)
} 

//Function => Make Alert Html And Show It 
export const showAlert = (type , msg)=>{
    hideAlert()
    const markup = `<div class="alert alert--${type}">${msg}</div>`
    document.querySelector("body").insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(hideAlert,3000)
}