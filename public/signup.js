const myForm = document.querySelector('#my-form');
        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');
        const passwardInput = document.querySelector('#passward');

        myForm.addEventListener('submit', onSubmit);
           
        function onSubmit(e){
          e.preventDefault();       
          const name=nameInput.value;
          const email=emailInput.value;
          const passward=passwardInput.value;
          const inputData={
            name,
            email,
            passward,
          };
          console.log(inputData);
          axios.post("http://localhost:3000/user/signup",inputData)
            .then((response)=>{
              console.log(response)
              if(response.request.status==201){
                alert(response.data.message);
                window.location.href="./login.html";
              }
            })
            .catch((err)=>{
              console.log(err);
              console.log(err.response.data.error);
              document.body.innerHTML+=`<div style="color:red;">${err.response.data.error}<div>`;
              
            })
            nameInput.value = '';
            emailInput.value='';
            passwardInput.value = '';  
        }
       