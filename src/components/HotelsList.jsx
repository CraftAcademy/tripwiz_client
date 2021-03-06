import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getHotels } from "../modules/destination.js";
import { Map, InfoWindow, GoogleApiWrapper, Marker } from "google-maps-react";
import { Button } from "semantic-ui-react";
import { chooseHotel } from "../modules/destination.js";

const HotelsList = props => {
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState({});
  const [selectedPlaces, setSelectedPlaces] = useState({});
  const [hotelMessage, setHotelMessage] = useState("");
  const [currentHotels, setCurrentHotels] = useState(null)

  const getHotelsShowData = async () => {
    const response = await getHotels(props.trip);
    if (response.status === 200) {
      props.setHotels(response.data);
      if (response.data.length > 1) {
        setHotelMessage(
          `Here are the closest hotels to your activities. Please add one to your itinerary!`
        );
      } else {
        setHotelMessage("")
      }
      setCurrentHotels(response.data[0].id)
    }
  };

  const selectHotel = async (hotelId, hotelName) => {
    let response = await chooseHotel(props.trip, hotelId);
    if (response.status === 200) {
      await getHotelsShowData();
      setHotelMessage(
        `Ok, we've added ${hotelName} to your itinerary`
      );
    } else {
      setHotelMessage("Oops, Something went wrong");
    }
  };

  useEffect(() => {
    if (props.hotels[0].id !== currentHotels) {
      getHotelsShowData()
    }
  }, [props.hotels]);

  useEffect(() => {
    {props.hotels.length > 1 && (
      getHotelsShowData()
    )}
  }, [])

  let hotelCard;

  if (props.hotels) {
    hotelCard = props.hotels.map(hotel => {
      return (
        <div key={hotel.id} className="centerText">
          <div id="hotel-cards" className="ui card">
            <div className="image">
              <img src={hotel.url} />
            </div>
            <div className="content">
              <div className="header">{hotel.name}</div>
              <div className="description">
                {hotel.address}
                <br />
                {hotel.description}
              </div>
            </div>
            <div className="extra content">
              <div id="price-box">
                Deals from {hotel.price} {hotel.currency} / Night
              </div>
              {props.hotels.length !== 1 && (
                <Button onClick={() => selectHotel(hotel.id, hotel.name)}>
                  Add to Itinerary
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    });
  }

  let markers;

  if (props.hotels) {
    const onMarkerClick = (props, marker) => {
      setSelectedPlaces(props);
      setActiveMarker(marker);
      setShowingInfoWindow(true);
    };
    markers = props.hotels.map(marker => {
      return (
        <Marker
          key={marker.id}
          onClick={onMarkerClick}
          name={marker.name}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={{
            url: `/mapIcons/hotel.png`,
            scaledSize: new props.google.maps.Size(60, 60)
          }}
        />
      );
    });
  }

  return (
    <>
      <h5 id="hotel-msg">{hotelMessage}</h5>
      <div className="ui stackable four column grid">{hotelCard}</div>
        <div className="hotels-map">
          <Map
            google={props.google}
            style={{ width: "93.5%", height: "65%", position: "relative" }}
            zoom={13}
            initialCenter={{
              lat: props.hotels[0].lat,
              lng: props.hotels[0].lng
            }}
            center={{ lat: props.hotels[0].lat, lng: props.hotels[0].lng }}
          >
            {markers}
            <InfoWindow marker={activeMarker} visible={showingInfoWindow}>
              <div>
                <h4>{selectedPlaces.name}</h4>
              </div>
            </InfoWindow>
          </Map>
        </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    hotels: state.hotels,
    trip: state.trip,
    gotHotels: state.gotHotels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setHotels: data => {
      dispatch({ type: "SET_HOTELS", payload: data });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_APIKEY
  })(HotelsList)
);
