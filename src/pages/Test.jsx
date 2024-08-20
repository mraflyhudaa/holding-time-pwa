import React from "react";
import DurationPicker from "react-duration-picker";

const Test = () => {
  const handleDurationChange = (duration) => {
    console.log(duration);
  };

  return (
    <div>
      <p>Test</p>
      <DurationPicker
        onChange={handleDurationChange}
        initialDuration={{ hours: 0, minutes: 0 }}
      />
      ;
    </div>
  );
};

export default Test;
