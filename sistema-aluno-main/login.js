function login(){


const user = document.getElementById("user").value;
const password = document.getElementById("password").value;

if (user == "66655544433" && password == "12345"){
    window.open("portal.html", "_self");
}
else{
    window.alert("Senha Errada");
}

}