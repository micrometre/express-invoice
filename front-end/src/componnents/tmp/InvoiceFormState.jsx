import React, { useState } from 'react';

function ParentComponent() {
  const [sharedState, setSharedState] = useState('');

  const handleChange = (event) => {
    setSharedState(event.target.value);
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <p>Shared State: {sharedState}</p>
      <ChildB sharedState={sharedState} onChange={handleChange} />
    </div>
  );
}


function ChildB({ sharedState, onChange }) {
  return (
    <div>
      <h2>Child B</h2>
      <input type="text" value={sharedState} onChange={onChange} />
    </div>
  );
}

export default ParentComponent;