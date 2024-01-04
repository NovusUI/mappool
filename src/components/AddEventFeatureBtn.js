import React from 'react'

const btnStyle = {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
}

const styles = {
    addBtn :{
       ...btnStyle,
       backgroundColor: "#70D77B"
    },

    removeBtn : {
        ...btnStyle,
        backgroundColor: "#EE6464"
    }
   
}



const AddEventFeatureBtn = ({featuresSelected, setFeaturesSelected, featureType}) => {

    console.log(featuresSelected)

    const addOrRemoveFeature = (add,type) =>{
    
        if(add){
            setFeaturesSelected(prev=>[...prev,type])
        }else{
            setFeaturesSelected(prev=>prev.filter(p=> p != type))
        }
    }
  return (
    <>
     
    {
        !featuresSelected.includes(featureType) && 
        <div style={styles.addBtn} onClick={()=>addOrRemoveFeature(true,featureType)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 10.625V4.375" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
             <path d="M4.375 7.5H10.625" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    </div> 
    }
    {
        featuresSelected.includes(featureType) &&
        <div style={styles.removeBtn} onClick={()=>addOrRemoveFeature(false,featureType)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.40625 7.03125H13.5938V7.96875H1.40625V7.03125Z" fill="white"/>
            </svg>
        </div>
    }
    </>
  )
}

export default AddEventFeatureBtn
