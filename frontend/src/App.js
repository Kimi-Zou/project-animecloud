// External dependencies
import React, { useState, useEffect }  from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

// Internal dependencies
import * as sessionActions from "./store/session";
import * as trackActions from "./store/track";
import * as userActions from "./store/user";

import MusicPlayerContextProvider from "./context/MusicPlayerContext";

import Home from "./components/Home";
import Navigation from "./components/Navigation";
import UploadTrack from "./components/UploadTrack";
import Discover from "./components/Discover";
import Profile from "./components/Profile";
import MusicPlayer from "./components/MusicPlayer";

//--------------------- Component ------------------------
// Render order: component -> useEffect -> component 
function App() {
  // State ------------------------
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user); 

  const [isLoaded, setIsLoaded] = useState(false);


  // When page first load, restore user
  // Get popular artists for discover page
  // Get recent released tracks for discover page
  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => dispatch(userActions.getPopularArtists()))
      .then(() => dispatch(trackActions.getRecentReleasedTracks()))
      .then(() => setIsLoaded(true));
  }, [dispatch]);

  // Render ------------------------
  return isLoaded && (
    <>
      {sessionUser && (
        <>
          <Navigation isLoaded={isLoaded}/>
          <MusicPlayerContextProvider>
            <MusicPlayer />
          </MusicPlayerContextProvider>
        </>
      )}
      {!sessionUser && <Route path="/"><Redirect to="/"></Redirect></Route>}
      <Switch>
        <Route exact path="/">
          {!sessionUser && <Home />}
        </Route>
        <Route exact path="/discover">
          <Discover />
        </Route>
        <Route exact path="/settings">
          <div>Settings</div>
        </Route>
        <Route exact path="/upload">
          <UploadTrack user={sessionUser}/>
        </Route>
        <Route exact path="/:username/profile">
          <Profile />
        </Route>
        <Route exact path="/users/:username">
          <Profile />
        </Route>
        <Route>
          <div>Page Not Found</div>
        </Route>
      </Switch>
      
    </>
  );
}

export default App;
