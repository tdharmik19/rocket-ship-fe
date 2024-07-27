import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../common/utils/env.config';
import { ACCESS_TOKEN } from '../../../common/utils/config';
import { useNavigate } from 'react-router-dom';

const Card = ({cards,setCards,initialCards,onCardsUpdate}) => {
  const headers = { 'Content-Type': 'application/json','Authorization': ACCESS_TOKEN };
  const [data,setData] = useState([])
  const navigate = useNavigate();
  const handleData = () => {
    axios.get(BACKEND_URL + `/userpartner/custom_courier_priority?user_id=${sessionStorage.getItem('user_id')}`,{headers:headers})
    .then((res) => {
      console.log("Data Courier",res.data)
      const responseNames = res.data; 

      const updatedCards = cards.map((card, index) => {
       
        if (responseNames && responseNames[index]) {
          console.log("IUJUUUUUUUU")
          return { ...card, name: responseNames[index] };
        }
        console.log("OPPPPPPP")
        return { ...card, name: initialCards[index].name };
      });

      setCards(updatedCards);
      console.log("CARDSSSSSS",cards)
    }).catch((err) => {
      console.log("Error In Fetching Data",err)
    })
  }

  useEffect(() => {
    handleData()
  },[])

  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    const cardsCopy = [...cards];
    const draggedItemContent = cardsCopy[dragItem.current];
    cardsCopy.splice(dragItem.current, 1);
    cardsCopy.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setCards(cardsCopy);
    console.log("Cardssss",cards)
    onCardsUpdate(cardsCopy);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-200 rounded-md">
      <h1 className="text-base text-center mb-4"><i className="fa-solid fa-up-down-left-right mr-2"></i>Drag to Set Your Priority</h1>
      <div className="flex flex-wrap space-x-4 p-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-md p-4 w-60 h-96 cursor-move mb-4 ml-4"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex items-center justify-center mb-2">
              <img
                src={card.img_name}
                alt={card.name}
                className="w-20 h-20"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
                <h3 className="text-sm mb-1">{card.name}</h3>
                <p className="text-gray-500 text-sm mb-2">Min. Weight: {card.minWeight}</p>
            </div>
            <div className="border-t border-gray-300 mt-2 mb-2"></div>
            <p className="text-sm mb-6 mt-4">
              <span className="text-gray-500 text-xs">Call Before Delivery:</span> {card.callBeforeDelivery}
            </p>
            <p className="text-sm mb-6">
              <span className="text-gray-500 text-xs">POD:</span> {card.pod}
            </p>
            <p className="text-sm mb-6">
              <span className="text-gray-500 text-xs">Delivery Boy Number:</span> {card.deliveryBoyNumber}
            </p>
            <p className="text-sm mb-6">
              <span className="text-gray-500 text-xs">Tracking Services:</span> {card.trackingServices}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;