const myForm = document.querySelector('#my-form');
const emailInput = document.querySelector('#email');

myForm.addEventListener('submit', onSubmit);
   
function onSubmit(e){
  e.preventDefault();       
  const email=emailInput.value;
  const inputData={
    email
  }
  console.log(inputData)
  axios.post("http://localhost:3000/password/forgotpassword",inputData)
    .then((response)=>{
        console.log(response);
        window.location.href = "./login.html";
    })
    .catch((err)=>{
      console.log("request for forgetpassward failed in frontend")
      document.body.innerHTML+=`<div style="color:red;">${err.response.data.message}<div>`;
      console.log(err);
    })
    emailInput.value='';
} 