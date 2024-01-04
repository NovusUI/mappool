import React from 'react'
import AddEventFeatureBtn from '../AddEventFeatureBtn'

const EventFeatures = ({event,handleClick, featureType, isEditEvent, featuresSelected, setFeaturesSelected}) => {

    const featureTypes = {
        'carpool':{
            title: "Carpool",
            image: "/carpool.png",
            isAvailable: true,
        },
        'getTicket': {
            title: "Get Ticket",
            image: "/ticket.png",
            isAvailable: false,
        },
        'experienceEvent': {
            title: "Experience Event",
            image: "/vrhs.png",
            isAvailable: false,
        }
    }
  return (

      <div className="event-feature" onClick={()=>handleClick(event?.id)}> 
        {isEditEvent &&  featureTypes[featureType].isAvailable && <AddEventFeatureBtn featuresSelected={featuresSelected} setFeaturesSelected={setFeaturesSelected} featureType={featureType}/> }
        <div className='ef-img'>
          <img src={featureTypes[featureType].image}></img>
        </div>
        <p className='feature-title'>{featureTypes[featureType].title}</p>
      </div>

  )
}

export default EventFeatures
