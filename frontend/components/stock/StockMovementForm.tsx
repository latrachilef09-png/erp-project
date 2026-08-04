"use client";

import { useState } from "react";
import api from "@/lib/api";


export default function StockMovementForm(){

const [type,setType] = useState("IN");

const [form,setForm] = useState<any>({
  productId:1,
  warehouseId:3,
  quantity:0,
  reference:"",
});


function update(
 key:string,
 value:any
){

setForm({
 ...form,
 [key]:value
});

}



async function submit(){


try{


let url="";


let data:any={...form};


switch(type){


case "IN":

url="/stock-movements/in";

break;


case "OUT":

url="/stock-movements/out";

break;


case "TRANSFER":

url="/stock-movements/transfer";

data={
 ...form,
 fromWarehouseId:form.fromWarehouseId,
 toWarehouseId:form.toWarehouseId
};

break;



case "CORRECTION":

url="/stock-movements/correction";

break;


}



const response =
await api.post(url,data);





alert("Movement created");


}catch(error){

console.error(error);

alert("Error creating movement");

}


}




return (

<div className="space-y-5 p-5">


<h1 className="text-2xl font-bold">
Create Stock Movement
</h1>



<select

className="border p-2"

value={type}

onChange={(e)=>setType(e.target.value)}

>

<option value="IN">
IN
</option>

<option value="OUT">
OUT
</option>

<option value="TRANSFER">
TRANSFER
</option>

<option value="CORRECTION">
CORRECTION
</option>


</select>





<input

className="border p-2 block"

placeholder="Product ID"

type="number"

value={form.productId}

onChange={
(e)=>update(
"productId",
Number(e.target.value)
)
}

/>




{
type!=="TRANSFER" &&

<input

className="border p-2 block"

placeholder="Warehouse ID"

type="number"

value={form.warehouseId}

onChange={
(e)=>update(
"warehouseId",
Number(e.target.value)
)
}

/>

}





{
type==="TRANSFER" &&

<>

<input

className="border p-2 block"

placeholder="From Warehouse ID"

type="number"

onChange={
(e)=>update(
"fromWarehouseId",
Number(e.target.value)
)
}

/>



<input

className="border p-2 block"

placeholder="To Warehouse ID"

type="number"

onChange={
(e)=>update(
"toWarehouseId",
Number(e.target.value)
)
}

/>

</>

}




<input

className="border p-2 block"

placeholder="Quantity"

type="number"

value={form.quantity}

onChange={
(e)=>update(
"quantity",
Number(e.target.value)
)
}

/>



<input

className="border p-2 block"

placeholder="Reference"

value={form.reference}

onChange={
(e)=>update(
"reference",
e.target.value
)
}

/>



{
type==="CORRECTION" &&

<input

className="border p-2 block"

placeholder="Reason"

onChange={
(e)=>update(
"reason",
e.target.value
)
}

/>

}




<button

className="border px-4 py-2"

onClick={submit}

>

Create movement

</button>



</div>

)

}