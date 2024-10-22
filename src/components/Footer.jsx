function Footer() {
  return (
    <>
      <hr />
      <footer className="bg-white py-16">
        {" "}
        {/* increased padding to py-16 */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-12">
          {" "}
          {/* increased padding to px-6 and gap to 12 */}
          {/* Company Info */}
          <div>
            <h2 className="text-black font-bold text-xl mb-6">Electro Point.</h2>{" "}
            {/* increased font size to text-xl */}
            <address className="text-gray-500 text-lg">
              {" "}
              {/* increased font size to text-lg */}
              400 University Drive Suite 200 <br />
              Coral Gables, FL 33134 USA
            </address>
          </div>
          {/* Links */}
          <div>
            <h3 className="text-black font-semibold text-lg mb-6">Links</h3>{" "}
            {/* increased font size to text-lg */}
            <ul className="space-y-4">
              {" "}
              {/* increased space between list items to 4 */}
              <li>
                <a href="#" className="text-gray-700 hover:text-black text-lg">
                  {" "}
                  {/* increased font size to text-lg */}
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-black text-lg">
                  {" "}
                  {/* increased font size to text-lg */}
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-black text-lg">
                  {" "}
                  {/* increased font size to text-lg */}
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-black text-lg">
                  {" "}
                  {/* increased font size to text-lg */}
                  Contact
                </a>
              </li>
            </ul>
          </div>
          {/* Help */}
          <div>
            <h3 className="text-black font-semibold text-lg mb-6">Help</h3>{" "}
            {/* increased font size to text-lg */}
            <ul className="space-y-4">
              {" "}
              {/* increased space between list items to 4 */}
              <li>
                <a href="#" className="text-gray-700 hover:text-black text-lg">
                  {" "}
                  {/* increased font size to text-lg */}
                  Payment Options
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-black text-lg">
                  {" "}
                  {/* increased font size to text-lg */}
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-black text-lg">
                  {" "}
                  {/* increased font size to text-lg */}
                  Privacy Policies
                </a>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
              <h4 className="text-sm font-bold text-gray-500 mb-2">Newsletter</h4>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter Your Email Address" 
                  className="border border-gray-300 px-4 py-2 w-full text-black rounded-md"
                />
                <button className="px-4 py-2 bg-black text-white font-semibold rounded-md">
                  SUBSCRIBE
                </button>
              </div>
            </div>
        </div>
        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-300 pt-6">
          {" "}
          {/* increased margin to mt-12 and padding to pt-6 */}
          <p className="mt-5 ml-10 text-start text-gray-500 text-lg">
            {" "}
            {/* increased font size to text-lg */}© 2023 Electro point. All rights
            reserved
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
