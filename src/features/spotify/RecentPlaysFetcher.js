import React, { useEffect, useState } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { setRecentPlays } from './recentPlaysSlice';
import axios from 'axios';
import { selectAuthorizationCode } from '../auth/authSlice';
import { selectHistoricPlays, setHistoricPlays } from './historicPlaysSlice';
import { saveAs } from 'file-saver';

let refreshToken = null; // Store the refresh token

const getAccessToken = async (authorizationCode) => {
    let accessToken = '';

    const formValues = new URLSearchParams();

    if (!refreshToken) {
        formValues.append('grant_type', 'authorization_code');
        formValues.append('code', authorizationCode);
        formValues.append('redirect_uri', process.env.REACT_APP_SPOTIFY_REDIRECT_URI);
        formValues.append('client_id', process.env.REACT_APP_SPOTIFY_CLIENT_ID);
        formValues.append('client_secret', process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);
    } else {
        formValues.append('grant_type', 'refresh_token');
        formValues.append('refresh_token', refreshToken);
        formValues.append('client_id', process.env.REACT_APP_SPOTIFY_CLIENT_ID);
        formValues.append('client_secret', process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', formValues);
        const data = response.data;

        accessToken = data.access_token;

        if (!refreshToken) {
            refreshToken = data.refresh_token;
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
    }

    return accessToken;
};

const updateHistoricPlaysWithNewPlays = (newPlays, historicPlays) => {
    const updatedPlays = [...historicPlays];

    if (historicPlays.length === 0) {
        for (let i = newPlays.length - 1; i >= 0; --i) {
            updatedPlays.push(newPlays[i]);
        }
        return updatedPlays;
    }

    let addEndIndex = -1;
    const lastUpdatedIndex = updatedPlays.length - 1;

    for (let i = 0; i < newPlays.length; ++i) {
        if (newPlays[i].track?.id === historicPlays[lastUpdatedIndex].track?.id &&
            newPlays[i].played_at === historicPlays[lastUpdatedIndex].played_at) {
            break;
        } else {
            addEndIndex = i;
            continue;
        }
    }

    if (addEndIndex > -1) {
        for (let i = addEndIndex; i >= 0; --i) {
            updatedPlays.push(newPlays[i]);
        }
    }

    return updatedPlays;
};

const RecentPlaysFetcher = ({ playsToFetch }) => {
    const dispatch = useDispatch();
    const store = useStore();
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleFilePicker = async () => {
        const state = store.getState();
        let historicPlays = selectHistoricPlays(state);

        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            if (fileHandle) {
                const file = await fileHandle.getFile();
                const fileContent = await file.text();

                if (fileContent) {
                    historicPlays = JSON.parse(fileContent);
                }
            }
        } catch (error) {
            console.error('Error fetching historic plays:', error);
        }

        if (historicPlays.length > 0) {
            dispatch(setHistoricPlays(historicPlays));
        }

        setIsButtonClicked(true); // Update state to trigger useEffect
    };

    const handleSaveFile = () => {
        const state = store.getState();
        const historicPlays = selectHistoricPlays(state);
        const blob = new Blob([JSON.stringify(historicPlays)], { type: 'application/json' });
        saveAs(blob, 'PlayCounts.json');
        setIsButtonClicked(false); // Update state to trigger useEffect
    };

    useEffect(() => {
        if (!isButtonClicked) return; // Exit early if button hasn't been clicked

        const fetchRecentPlays = async () => {
            const state = store.getState();
            const authorizationCode = selectAuthorizationCode(state);

            const accessToken = await getAccessToken(authorizationCode);

            if (accessToken) {
                const historicPlays = selectHistoricPlays(state);

                const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${playsToFetch}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();
                const newPlays = data.items;

                const updatedPlays = updateHistoricPlaysWithNewPlays(newPlays, historicPlays);
                dispatch(setHistoricPlays(updatedPlays));

                console.log('Fetching recent plays data: ', updatedPlays);
            }
        };

        fetchRecentPlays(); // Initial fetch

        const intervalId = setInterval(fetchRecentPlays, 300000); // Fetch every 5 minutes

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [dispatch, playsToFetch, store, isButtonClicked]);

    return (
        <div>
            <button onClick={handleFilePicker}>Load Historic Plays</button>
            <button onClick={handleSaveFile}>Save Historic Plays</button>
        </div>
    );
};

export default RecentPlaysFetcher;
