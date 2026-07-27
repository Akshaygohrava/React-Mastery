import { useState } from "react"
const TodoApp = () => {
    const [input, setInput] = useState("");
    const [todo, setTodo] = useState([]);
    const addTodo = () => {
            if (input.trim() === "") {
                return
            }
            const newTodo = {
                id: Date.now(),
                input: input
            }
            setTodo([...todo, newTodo]);
            setInput("");
    }
    return (
        <>
          <h2 className="todo-title">React ToDo App</h2>

          <input type="text" name="todoapp" id="todo-input" value={input} onChange={(e) => setInput(e.target.value)} />

          <button className="todo-btn" onClick={addTodo}>CREATE</button>

          <h2>{input}</h2>

          <h2 style={{
            textAlign: "center",
            marginBottom: "20px"
          }}>Todo Lists</h2>

          {todo.map(item => (
            <div>
                <div className="todo-items" key={item.id}>{item.input}</div>
            </div>
          ))}

          


          


        </>
    )
}

export default TodoApp