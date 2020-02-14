import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Tab, Grid, GridColumn } from "semantic-ui-react";
import ResultMap from "./ResultMap";
import { getActivities, getTrips, getRestaurants } from "../modules/destination.js";
import ActivitiesList from "./ActivitiesList";
import RestaurantsList from "./RestaurantsList";
import HotelsList from "./HotelsList";
import TripsList from "./TripsList";

const Result = props => {
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
      props.setSelectedCard(response.data[0]);
      props.setTrips(response.data)
    }
  };

  useEffect(() => {
    setActivities();
    setRestaurants()
    getTripsData()
  }, [props.trip]);

  return (
    <>
      <div className="trip-section">
        <h1 className="result-title">
          {props.days} days in {props.destination}
        </h1>
        <h5>Enjoy the {props.activityType}s!</h5>
        <Grid>
          <GridColumn width={4}>
            <TripsList />
          </GridColumn>
          <GridColumn width={12}>
            <div id="main2" className="centered">
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
    activityType: state.activityType
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Result);
