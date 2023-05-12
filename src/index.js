import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = () => {
  	
	const [inputText, setInputText] = useState("");
  const [selectedImageURL, setSelectedImageURL] = useState("");
  const [imageURLs, setImageURLs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLabels, setImageLabels] = useState([]);
  const [activeDiv, setActiveDiv] = useState("search");


  
	const handleActiveDiv = () => {
    setActiveDiv("upload");
    setImageURLs([]);

  };

  const handleUploadImage = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
  
      try {
        const response = await fetch("https://delta-athlete-385718.uc.r.appspot.com/api/images/upload", {
          method: "POST", 
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data.url);
          console.log(data.labels);
          setSelectedImageURL(data.url);
          setImageLabels(data.labels);
          setActiveDiv("imageLabels");
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        console.error(error);
      }
      setSelectedImage(null);
    }
  };

	const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputText.trim() !== "") {
				handleUseTag();
        setInputText("");
      }
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

	const handleUseTag = async () => {	
    try {
      const response = await fetch("https://delta-athlete-385718.uc.r.appspot.com/api/images/searchByTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tag: inputText }),
      });
      if (response.ok) {
        const data = await response.json();
        setImageURLs(data);
      } else { 
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error(error);
    }
		setInputText("");
  };
  return (
    <div className="container">
      <h1 className="title">VISUAL SEARCH</h1>
      <div className="search-bar">
        {activeDiv === "search" && (
          <form>
            <input
              type="text"
              placeholder="Search"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="button" onClick={handleUseTag}>Find By Tag</button>
            <button type="button" onClick={handleActiveDiv}> Use Image </button>
          </form>
        )}
        {activeDiv === "upload" && (
          <form>
            <label className="file-upload">
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            <button type="button" onClick={handleUploadImage}>Upload Image</button>
          </form>
        )}
        {activeDiv === "imageLabels" && (
          <div className="image-labels">
            <div className="selected-image-container">
              <img key={selectedImageURL} src={selectedImageURL} alt="Selected" className="selected-image" />
            </div>
            <div className="labels-container">
              <h2>Image Labels:</h2>
              <ul className="labels-list">
                {imageLabels.map((label, index) => (
                  <li key={index}>{label}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {activeDiv !== "imageLabels" &&  imageURLs.length > 0 && (
        <div className="image-list">
          <div className="image-container">
            {imageURLs.map((url) => (
              <img key={url} src={url} alt="Search Result" className="image-item" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

root.render(<App />);
