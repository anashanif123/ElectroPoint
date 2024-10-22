import backgroundImage from "../assets/pics/Rectangle 1.jpg";
import Benefits from "../components/Benefit";
import Best from "../components/Best";
import Footer from "../components/Footer";

function Productcomparison() {
  return (
    <div>
      <div className="relative text-center">
        <div className="relative">
          <img
            className="w-full h-[50vh] object-cover object-center"
            src={backgroundImage}
            alt="Scandinavian interior mockup wall decal background"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
            <h1 className="text-4xl font-bold">product camparison</h1>
            <span className="text-lg mb-2">Home &gt; camparison</span>
          </div>
        </div>
      </div>

      <Best />

      <Benefits />
      <Footer />
    </div>
  );
}
export default Productcomparison;
