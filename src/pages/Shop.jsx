import Benefits from "../components/Benefit";
import Footer from "../components/Footer";

import Productvip from "../components/Products";


function Shop() {
 

  return (
    <>
   <div className="relative text-center">
    <div className="absolute inset-0 flex flex-col items-center justify-center text-black bg-gradient-to-b from-white to-blue-200 p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold mt-8">Shop</h1>
        <p className="text-lg text-gray-700 mb-8">
            Discover a wide range of products at unbeatable prices.
        </p>
       
    </div>
</div>

<br />
<br />
      
      <Productvip />
      <Benefits/> 
      <Footer/>
    
</>  
);

}

export default Shop;