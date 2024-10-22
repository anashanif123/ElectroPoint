import image1 from "../assets/pics/Rectangle 38.png";
import image2 from "../assets/pics/Rectangle 39.png";
import image3 from "../assets/pics/Rectangle 40.png";
import image4 from "../assets/pics/Rectangle 41.png";
import image5 from "../assets/pics/Rectangle 43.png";
import image6 from "../assets/pics/Rectangle 44.png";
import image7 from "../assets/pics/Rectangle 45.png";
import image8 from "../assets/pics/Rectangle 68 (1).jpg";

function Gallery() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="grid gap-4">
        <div>
          <img
            className="h-auto max-w-full"
            src={image1}
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full"
            src={image2}
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full"
            src={image3}
            alt=""
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img
            className="h-auto max-w-full"
            src={image4}
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full"
            src={image5}
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full"
            src={image6}
            alt=""
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img
            className="h-auto max-w-full"
            src={image7}
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full"
            src={image8}
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full"
            src={image1}
            alt=""
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img
            className="h-auto max-w-full"
            src={image2}
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full"
            src={image3}
            alt=""
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full"
            src={image4}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Gallery;
