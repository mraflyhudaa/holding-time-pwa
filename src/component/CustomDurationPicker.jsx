import React, { useState } from "react";

const CustomDurationPicker = ({ onChange }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleHoursChange = (e) => {
    setHours(e.target.value);
    onChange({ hours: e.target.value, minutes });
  };

  const handleMinutesChange = (e) => {
    setMinutes(e.target.value);
    onChange({ hours, minutes: e.target.value });
  };

  return (
    <div>
      <input
        type="number"
        value={hours}
        onChange={handleHoursChange}
        placeholder="Hours"
      />
      <input
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        placeholder="Minutes"
      />
    </div>
  );
};

export default CustomDurationPicker;
