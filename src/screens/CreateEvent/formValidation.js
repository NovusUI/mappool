

const isValidDate = (dateString) => {
    try {
        const inputDate = new Date(dateString);
        const currentDate = new Date();
        
         // Calculate the date 2 years from now
         const maxDate = new Date();
         maxDate.setFullYear(maxDate.getFullYear() + 2);
        // Check if the input date is not in the past
        return inputDate >= currentDate &&  inputDate <= maxDate;
    } catch (error) {
        return false;
    }
}

const isEndTimeValid = (startTime, endTime)=> {
    try {
        const startDateTime = new Date(`2000-01-01T${startTime}`);
        const endDateTime = new Date(`2000-01-01T${endTime}`);

        // Compare the time values
        return endDateTime > startDateTime;
    } catch (error) {
        return false; // Handle invalid time formats
    }
}

export const validateEventName = (value)=>{

    if( value.length > 25){
        return "too long" 
    }
    if( value.length < 5){
        return "too short" 
    }
    
    return null
}

export const validateDescription = (value)=>{

    if(value.length < 10){
        return "too short"
    }
    if( value.length > 301){
       return "too long"
    }
    return null
}

export const validateDate = (value)=>{
   
    console.log(value.length)
    if(value.length === 0){
        return "set date"
    }
    if(!isValidDate(value)){

        console.log("invalida date")
        return "invalid date"
    }
    console.log("null")
    return null
}

export const validateStartTime= (value)=>{

    if(value.length === 0){
        return "set start time"
    }
   
    return null
}

export const validateEndTIme = (startValue, endValue)=>{

    if(endValue.length === 0){
        return "set end time"
    }
    if(!isEndTimeValid(startValue,endValue)){
        console.log("less than start time")

        return "less than start time"
    }
    return null
}

export const validateLocation = (value)=>{
    if(value.length < 2){
        return "not valid"
    }
    if( value.length > 25){
        return "too long" 
    }
    return null
}