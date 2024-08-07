import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthorizationCode } from './authSlice';
import { useLocation } from 'react-router-dom';

const Authorize = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  const scopes = 'user-read-recently-played';

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authorizationCode = queryParams.get('code');

    if (authorizationCode) {
      dispatch(setAuthorizationCode(authorizationCode));
    } else {
      const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
      window.location.href = authorizationUrl;
    }
  }, [dispatch, location.search, clientId, redirectUri, scopes]);

  return null;
};

export default Authorize;
