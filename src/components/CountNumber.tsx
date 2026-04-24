import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const CountNumber = () => {
  const [count, setCount] = useState(0);
  const [fullName, setFullName] = useState("Guest");
  useEffect(() => {
    if (count === 5) {
      console.log("It's work");
      setFullName("Not a guest");
    }
  }, [count]);
  return (
    <div className="flex gap-5">
      <Button className="bg-green-500" onClick={() => setCount(count + 1)}>
        {" "}
        +{" "}
      </Button>
      {count}
      <Button className="bg-red-500" onClick={() => setCount(count - 1)}>
        {" "}
        -{" "}
      </Button>
      {fullName}
    </div>
  );
};

export default CountNumber;
