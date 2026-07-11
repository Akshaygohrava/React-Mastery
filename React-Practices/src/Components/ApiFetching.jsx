import { useState, useEffect } from "react"

const ApiFetching = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
       async function fetching() {
            try {
                const url = await fetch("https://fakestoreapi.com/products");
                const res = await url.json();
                setData(res)
            } catch(error) {
                console.log(error);
            }
       }
       fetching();
},[])
    return (
        <>
          <h1>API Fetching</h1>
             
             <ul>
                {
                    data.map((props, index) => {
                        return <li key={index}>{props.title}</li>
                    })
                }
             </ul>

        </>
    )
}
export default ApiFetching