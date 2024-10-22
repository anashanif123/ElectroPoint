import Benefits from "../components/Benefit";
import Footer from "../components/Footer";

import Productvip from "../components/Products";


function Shop() {
 

  return (
    <div>
      <div className="relative text-center">
       
          <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
            <h1 className="text-4xl font-bold">Shop</h1>
            
          
        </div>
      </div>

      
      <Productvip />
      <Benefits/> 
      <Footer/>
    </div>
  );
}

export default Shop;