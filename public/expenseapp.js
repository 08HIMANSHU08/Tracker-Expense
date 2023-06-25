
const myForm = document.querySelector('#my-form');
const expenseInput = document.querySelector('#expense');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const listOfExpense = document.querySelector('#listofexpense');

const token = localStorage.getItem('token');

let rows = localStorage.getItem('rows');
  document.getElementById('rowsclick').onclick=function(){
    localStorage.setItem("rows",Number(document.getElementById('paginationnumber').value));
}

document.getElementById("submitform").onclick= function(e){
  e.preventDefault();       
  const exp=expenseInput.value;
  const desc=descriptionInput.value;
  const cat=categoryInput.value;
  const inputData={
    exp,
    cat,
    desc
  };
  
  axios.post("http://localhost:3000/expense/add-expense",inputData,{headers:{"Authorization":token}})
    .then((response)=>{
      console.log(response);
      showuser(response.data.newExpense);
    })
    .catch((err)=>{
      console.log(err);
    })
    expenseInput.value = '';
    descriptionInput.value='';
    categoryInput.value = '';  
}


function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
   return JSON.parse(jsonPayload);
}

function showPremiumFeature(){
  document.getElementById("razorpayBuy").style.visibility="hidden";
  document.getElementById("message").innerHTML="Premium User";
  const downloadBtn = document.createElement("input");
  downloadBtn.className="btn btn-warning btn-sm btn-outline-dark float-end m-2";
  downloadBtn.type= "button";
  downloadBtn.value="Download ";
  downloadBtn.onclick = function(){download()};
  document.getElementById('premium').appendChild(downloadBtn)
}

function download(){
  axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
  .then((response) => {
    console.log(response.data.urls)
      showUrls(response.data.urls);
      if(response.status === 200){
          var a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = 'myexpense.csv';
          a.click();
      } else {
          throw new Error(response.data.message)
      }
  })
  .catch((err) => {
    console.log(err)
    document.body.innerHTML+=`<div style="color:red;">${err.response.data.err.message}<div>`;
  });
}

function showUrls(urls){
  let urlElement = document.getElementById('dataurls');
  urlElement.innerHTML+="<h3>URLS</h3>";
  urls.forEach(url=>{
    urlElement.innerHTML+=`<li class="list-group-item">URL= ${url.url} </li>`;
  })
}
function showleaderBoard(){
  const leaderBoard = document.createElement("input");
  leaderBoard.className="btn btn-warning btn-sm btn-outline-dark float-end m-2";
  leaderBoard.type="button";
  leaderBoard.value="Show LeaderBoard";
  document.getElementById('premium').appendChild(leaderBoard)
  leaderBoard.onclick= async function(e){
    e.preventDefault();
    const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/show-leaderboard',{headers:{"Authorization":token}})
    console.log(userLeaderBoardArray);
    let leaderBoardElement = document.getElementById('leaderboardlist');
    leaderBoardElement.innerHTML+="<h3>Leader Board</h3>";
    userLeaderBoardArray.data.forEach((userDetails)=>{
      leaderBoardElement.innerHTML+=`<li class="list-group-item">Name:- ${userDetails.name} & Total Expense:- ${userDetails.totalexpense}</li>`;
    })
  }
  
}

  window.addEventListener("DOMContentLoaded",()=>{
    const page = 1;
  const decodeToken = parseJwt(token);
  if(decodeToken.ispremiumuser==true)
  {
    showPremiumFeature();
    showleaderBoard();
  }
  let row=(rows==0) ? 3: rows;
  axios.get(`http://localhost:3000/expense/get-expense/page=${page}/rows=${row}`,{headers:{"Authorization":token}})
    .then((response)=>{
      showlists(response.data.allExpense);
      showPagination(response.data);
    })
      .catch((err)=>{console.error(err)});
});

  


function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
}){
  pagination.innerHTML = "";
  
  if(hasPreviousPage){
    const btn2 = document.createElement('button');
    btn2.id="btn"
    btn2.innerHTML = previousPage;
    btn2.addEventListener('click',()=>{
      getExpense(previousPage,lastPage) 
    });
    pagination.appendChild(btn2);
    showpageof(currentPage);
  }
  const btn1 = document.createElement('button');
    btn1.innerHTML = currentPage;
    btn1.addEventListener('click',()=>getExpense(currentPage));
    pagination.appendChild(btn1);
    showpageof(currentPage,lastPage);

  if(hasNextPage){
    const btn3 = document.createElement('button');
    btn3.innerHTML = nextPage;
    btn3.addEventListener('click',()=>getExpense(nextPage));
    pagination.appendChild(btn3);
    showpageof(currentPage,lastPage);
  }
}

function showpageof(currentPage,lastPage){
  let page=document.getElementById('showPageOneToLast');
  page.innerHTML="";
  const pageli=document.createElement("li")
  pageli.className="list-group-item"
  pageli.innerHTML=`Page ${currentPage} Of ${lastPage||1}`
    page.appendChild(pageli);
}

function getExpense(page){
  axios.get(`http://localhost:3000/expense/get-expense/page=${page}/rows=${rows}`,{headers:{"Authorization":token}})
  .then((response)=>{
    showlists(response.data.allExpense);
    showPagination(response.data);
  })
  .catch((err)=>{console.log(err)})
}

function showlists(object){
  const parentitem=document.getElementById("listofexpense");
  parentitem.innerHTML="";
  for(let i=0;i<object.length;i++){
    
    const childitem=document.createElement("li");
    const deleteitem =document.createElement("input");
    deleteitem.className="btn btn-danger btn-sm btn-outline-dark float-end";
    deleteitem.type="button";
    deleteitem.value="Delete Expense";
     
    childitem.className="list-group-item"
    childitem.textContent=object[i].amount+" - "+object[i].category+" - "+object[i].description;
    
    deleteitem.onclick=()=>{
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/delete-expense/${object[i].id}`,{headers:{"Authorization":token}})
    .then((response)=>{
        console.log(response);
    })
    .catch((err)=>{
        console.log(err)
    });
      parentitem.removeChild(childitem);
  }
  childitem.appendChild(deleteitem);
  parentitem.appendChild(childitem);
  }
}

function showuser(object){
  const parentitem=document.getElementById("listofexpense");
  for(let i=0;i<object.length;i++){
    
    const childitem=document.createElement("li");
    const deleteitem =document.createElement("input");
    deleteitem.className="btn btn-danger btn-sm btn-outline-dark float-end";
    deleteitem.type="button";
    deleteitem.value="Delete Expense";
     
    childitem.className="list-group-item"
    childitem.textContent=object[i].amount+" - "+object[i].category+" - "+object[i].description;
    
    deleteitem.onclick=()=>{
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/delete-expense/${object[i].id}`,{headers:{"Authorization":token}})
    .then((response)=>{
        console.log(response);
    })
    .catch((err)=>{
        console.log(err)
    });
      parentitem.removeChild(childitem);
  }
  childitem.appendChild(deleteitem);
  parentitem.appendChild(childitem);
  }
}

document.getElementById("razorpayBuy").onclick= async function(e){
  e.preventDefault();
  await axios.get("http://localhost:3000/purchase/buypremiummembership",{headers:{"Authorization":token}})
  .then((response)=>{
    console.log("res",response);
      var options={
      "key":response.data.key_id,
      "order_id":response.data.order.id,
      "handler":async function(response){
        const res=await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
          order_id:options.order_id,
          payment_id:response.razorpay_payment_id,
        },{headers:{"Authorization":token}})
        alert("you are now a Premium User")
        showPremiumFeature();
        localStorage.setItem("token",res.data.token);
        showleaderBoard();
      }
    }
    const rzpl = new Razorpay(options);
    rzpl.open();
    e.preventDefault();
    rzpl.on('payment.failed', function(response){
      console.log(response);
      alert("Something Went Wrong With payment Please Try Again");
      window.location.href = "./expenseapp.html";
    })
  })
  .catch(err=>{console.log(err)});
}

document.getElementById("logout").onclick= async function(e){
  e.preventDefault();
  window.location.href = "./login.html";
}
