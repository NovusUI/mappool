import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Contact from "./ContactAsPoolee";
import SwitchBox from "../../components/SwitchBox";

const types = [
  "carpool",
  "pool"
];

const SwipeableContactYourRide = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0);
  const [poolType, setPoolType] = useState(types[1])

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(1),  // Swipe left, go to the next image
    onSwipedRight: () => handleSwipe(-1), // Swipe right, go to the previous image
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleSwipe = (delta) => {
    setCurrentIndex((prevIndex) => (prevIndex + delta + types.length) % types.length);
    setPoolType(types[currentIndex]);
  };

  return (
    <div>
      <div {...handlers} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Contact type={poolType}/>
      </div>

      <SwitchBox type={poolType} setPoolType={setPoolType}/>
      <div className="container" style={{backgroundColor:"#2F2F2F"}}>
        <button  onClick={()=> navigate("/role")}>Switch Role</button>
      </div> 
    </div>
  );
};

export default SwipeableContactYourRide;
