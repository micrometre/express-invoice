import React, { useState, createContext, useContext } from 'react';

const CountContext = createContext(); 

function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <CountContext.Provider value={{ count, setCount }}> 
      <div>
        <p>Parent Component: Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <ChildComponent />
      </div>
    </CountContext.Provider>
  );
}

function ChildComponent() {
  const { count, setCount } = useContext(CountContext);

  return (
    <div>
      <p>Child Component: Count: {count}</p>
      <button onClick={() => setCount(count - 1)}>Decrement</button> 
    </div>
  );
}



export default ParentComponent;