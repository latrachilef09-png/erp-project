export default function Navbar(){

const role=
localStorage.getItem("role");


return (

<nav>


<a>
Dashboard
</a>


{
role==="ADMIN" &&
<a>
Users
</a>
}


{
role==="ADMIN" ||
role==="STOCK_MANAGER"
?
<a>
Stock
</a>
:null
}



</nav>

)

}