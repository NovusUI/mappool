

export const firebaseTimeStampFormatter = (date, time)=>{
    
    // Convert date, startTime, and endTime to JavaScript Date objects
    const firebaseTimeStamp = new Date(`${date}T${time}`);
     
    return firebaseTimeStamp
}