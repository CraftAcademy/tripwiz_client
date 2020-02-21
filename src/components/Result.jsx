import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Tab, Grid, GridColumn, Button } from "semantic-ui-react";
import ResultMap from "./ResultMap";
import {
  getActivities,
  getTrips,
  getRestaurants,
  getHotels
} from "../modules/destination.js";
import ActivitiesList from "./ActivitiesList";
import RestaurantsList from "./RestaurantsList";
import HotelsList from "./HotelsList";
import TripsList from "./TripsList";
import { Redirect } from "react-router";

const Result = props => {
  const [redirect, setRedirect] = useState(false);

  const panes = [
    {
      menuItem: "Map",
      render: () => (
        <Tab.Pane>
          <ResultMap />
        </Tab.Pane>
      )
    },
    {
      menuItem: "Activities",
      render: () => (
        <Tab.Pane>
          <div className="ui stackable four column grid">
            <ActivitiesList />
          </div>
        </Tab.Pane>
      )
    },
    {
      menuItem: "Restaurants",
      render: () => (
        <Tab.Pane>
          <div className="ui stackable four column grid">
            <RestaurantsList />
          </div>
        </Tab.Pane>
      )
    },
    {
      menuItem: "Hotel",
      render: () => (
        <Tab.Pane>
          <HotelsList />
        </Tab.Pane>
      )
    }
  ];

  const setActivities = async () => {
    let response = await getActivities(props.trip);
    props.setActivities(response.data);
  };

  const setRestaurants = async () => {
    let response = await getRestaurants(props.trip);
    props.setRestaurants(response.data);
  };

  const getTripsData = async () => {
    let response = await getTrips();
    if (response.status === 200) {
      props.setTrips(response.data);
    }
  };

  const createTripHandler = async () => {
    if (props.authenticated) {
      props.updateProgression(0)
    } else {
      props.updateProgression(-1)
    }
    setRedirect(true)
  };

  const setHotels = async () => {
    let response = await getHotels(props.trip);
    props.setHotels(response.data);
  };

  useEffect(() => {
    setActivities();
    setRestaurants();
    setHotels();
    getTripsData();
  }, [props.trip]);

  useEffect(() => {
    setActivities();
    setRestaurants();
    setHotels();
    getTripsData();
  }, []);

  return (
    <>
      {redirect === true && <Redirect to="/trip" />}
      <div className="trip-section">
        <h1 className="result-title">
          <div className="resultTitle">
            <span id="result-title-number">{props.days}</span>
            <div id="result-underline">
              <span id="result-title-mid"> days in</span>
              <span id="result-dest"> {props.destination}</span>
            </div>
          </div>
        </h1>
        <h5>Enjoy the {props.activityType}s!</h5>
        <Button id="create-trip-button" onClick={createTripHandler}>Create new trip!</Button>
        <Grid>
          <GridColumn width={4}>
            <TripsList />
          </GridColumn>
          <GridColumn width={12}>
            <div id="main2">
              <Tab panes={panes} />
            </div>
          </GridColumn>
        </Grid>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    destination: state.destination,
    trip: state.trip,
    activities: state.activities,
    days: state.days,
    activityType: state.activityType,
    restaurants: state.restaurants,
    progression: state.progression,
    authenticated: state.activities
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActivities: data => {
      dispatch({ type: "SET_ACTIVITIES", payload: data });
    },
    setRestaurants: data => {
      dispatch({ type: "SET_RESTAURANTS", payload: data });
    },
    setSelectedCard: data => {
      dispatch({ type: "SET_SELECTEDCARD", payload: data });
    },
    setTrips: data => {
      dispatch({ type: "SET_TRIPS", payload: data });
    },
    setHotels: data => {
      dispatch({ type: "SET_HOTELS", payload: data });
    },
    updateProgression: value => {
      dispatch({ type: "UPDATE_PROGRESSION", payload: value });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Result);
