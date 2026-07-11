import { useState, useEffect } from "react"
import axios from "axios"

const AxisOs = () => {

    const [data, setData] = useState([]);
    
    useEffect(() => {
        async function fetchapi() {
             try {
                const response = await axios.get("https://fakestoreapi.com/users");
                setData(response.data);
             } catch(error) {
                console.log(error);
             }
        }
        fetchapi();
    },[])
    return (
        <>
           <h1>AxisOS API Fetching & CRUD Operations</h1>

            <ul>
                {
                    data.map((props, index) => {
                        return (
                            <>
                               <li key={index}>{props.email}</li>
                            </>
                        )
                    })
                }
            </ul>
             









        </>
    )
}

export default AxisOs