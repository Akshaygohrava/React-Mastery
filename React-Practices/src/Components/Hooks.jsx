import { useState } from "react"
import { useEffect } from "react"


const Hooks = () => {

    const [input, setInput] = useState("");

    const [count, setcount] = useState(0);

    const [inputs, SetInputs] = useState("");
    const [todo, setTodo] = useState([]);

    const addtodo = () => {
        if (inputs.trim() === "") {
            return
        }

        const newtodo = {
            id: Date.now(),
            inputs: inputs
        }

        setTodo([...todo, newtodo]);
        SetInputs("");

    }

      return (
        <>
          <h1>Learning React Hooks !</h1><br /><br />

          <h2>useState Hook</h2><br />

          <input type="text" onChange={(e) => setInput(e.target.value)} name="" id="" value={input} style={{border: "1px solid black"}} />

          <h2>{input}</h2><br /><br />

          <h2>UseState Counter</h2>
          <button onClick={() => setcount(count + 2 )}>Addition</button>&nbsp;&nbsp;
          <button onClick={() => setcount(count - 2 )}>Subtract</button>
          <h2>Count: {count}</h2><br /><br />


          <h2>Todo Apps</h2>

          <br />
          <input type="text" value={inputs} onChange={(e) => SetInputs(e.target.value)} /> &nbsp;&nbsp;

          <button onClick={addtodo}>Add Todo</button>

          <ul>
            {
                
                todo.map((item) => (
                   <>
                     <li style={{listStyleType: "disk"}} key={item.id}>{item.inputs}</li>
                   </>
                ))
                
                }
          </ul>




        </>
      )
}

export default Hooks