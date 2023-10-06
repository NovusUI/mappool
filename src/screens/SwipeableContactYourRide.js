import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Contact from "./ContactYourRide/Contact";

const types = [
  "ride",
  "pool"
];

const SwipeableContactYourRide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(1),  // Swipe left, go to the next image
    onSwipedRight: () => handleSwipe(-1), // Swipe right, go to the previous image
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleSwipe = (delta) => {
    setCurrentIndex((prevIndex) => (prevIndex + delta + types.length) % types.length);
  };

  return (
    <div>
      <div {...handlers} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Contact type={types[currentIndex]}/>
      </div>
    </div>
  );
};

export default SwipeableContactYourRide;
