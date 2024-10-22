import { Link } from "react-router-dom";
import backgroundImage from "../assets/pics/Group 142.jpg";


function BackgroundImage(){
    return(
        <>
        <div>

        <div className="bg-blue-50 py-16   ">
        <div className="container mx-auto flex flex-wrap px-5">
          <div className="w-full lg:w-1/2">
            <h1 className="text-8xl font-bold text-black">
              Grab <span className="text-blue-600">50%</span> Off Smartphone Collection
            </h1>
            <p className="mt-4 text-gray-500">
              Latest brand new and smart smartphones. Xiphone 14 Edition.
            </p>
            <button to={"/shop"} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Shop Now</button>
           
         <img src={backgroundImage} className="w-40 mx-auto rounded-lg mt-10"  />
         <div className="inline-block bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
          <span className="text-lg font-semibold bg-yellow-300 px-2 py-1 rounded">Highest Quality</span>
          <span className="text-lg font-semibold bg-purple-300 px-2 py-1 rounded ml-2">Xiphone 14 Edition</span>
        </div> 
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-end">
            <div className="rounded-lg overflow-hidden ">
              <img src="https://gallerypng.com/wp-content/uploads/2024/08/white-iphone-png-no-background-image.png" className="object-cover h-full w-full  bg-blue-50" />
            </div>
          </div>
        </div>
      </div>
      </div>
        </>
    )
}

export default  BackgroundImage;
