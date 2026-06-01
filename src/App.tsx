import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div></div>
      <h1 className="text-2xl font-bold">Test {count}</h1>
    </>
  );
}

export default App;
