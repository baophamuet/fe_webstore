import React from "react";
import { toast } from "react-toastify";
class Mycomponent extends React.Component {
    handleClickButtonTest = (event) =>{

        toast.success("Test thành công!!!");

    }
    render () {
        return(
            <>
            {console.log(`Tesst Mycomponent`)}
            Hi Mycomponent

            <button className="button-test" 
            onClick={(event)=>this.handleClickButtonTest(event)}
            > test </button>

            </>
        )
    }
    
}

export default Mycomponent
