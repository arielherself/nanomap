import React, {Component, useEffect, useRef, useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import {useMapEvents} from 'react-leaflet/hooks';
import {post} from './Networking';
import {Autocomplete, CircularProgress, Sheet} from "@mui/joy";
import SimulateClick from "./SimulateClick";

const AppleParkLoc=[37.334835049999995,-122.01139165956805];

class Markers extends Component {
    constructor(props) {
        super(props);
        this.state = {markers: [], candMarkers: []};
    }

    render() {
        const mks=this.state.markers.map((p, i) => (
            <Marker position={[p[0], p[1]]} opacity={1.0}><Popup>Generated
                by <code>Markers()</code></Popup></Marker>
        ));
        const cmks=this.state.candMarkers.map((p, i) => (
            <Marker interactive={false} position={[p[0], p[1]]} opacity={0.5}><Popup>Generated
                by <code>Markers()</code></Popup></Marker>
        ));
        return mks.concat(cmks);
    }

    addMarker(lat, lng) {
        this.setState((prev) => ({
            markers: [...prev.markers, [lat, lng]], candMarkers: prev.candMarkers,
        }));
        this.getFocus();
    }

    addCandMarker(lat, lng) {
        this.setState((prev) => ({
            candMarkers: [...prev.candMarkers, [lat, lng]],
            markers: prev.markers,
        }));
        this.getFocus();
    }

    clearMarkers() {
        this.setState((prev) => ({markers: [], candMarkers: prev.candMarkers}));
        this.getFocus();
    }

    clearCandMarkers(){
        this.setState((prev) => ({markers: prev.markers, candMarkers: []}));
        this.getFocus();
    }

    getFocus() {
        let currentFocus=[];
        if (this.state.candMarkers.length) {
            currentFocus=this.state.candMarkers.at(-1);
        } else if (this.state.markers.length) {
            currentFocus=this.state.markers.at(-1);
        } else {
            currentFocus=AppleParkLoc;
        }
        this.props.focusUpdater(currentFocus);
    }
}

function MapClickHandler({mks}) {
    const map = useMapEvents({
        click: (e) => {
            map.locate();
            const lat = e.latlng.lat, lng = e.latlng.lng;
            console.info(`Clicking on ${lat} ${lng}`);
            mks.current.addMarker(lat, lng);
            post('click', [lat, lng]);
        },
        // TODO
        locationfound: (location) => {
            console.info('location found:', location);
        },
    });
    return null;
}

const LocationSearch = ({mks}) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedLocations, setSuggestedLocations] = useState([]);
    const [controller, setController] = useState(new AbortController());

    useEffect(() => {
        return () => controller.abort();
    }, [query]);

    const handleSearch = async (e, v) => {
        const newController = new AbortController();
        setController(newController);
        setLoading(true);
        setQuery(v);
        try {
            // setSuggestedLocations([]);
            if (v.trim() === '') {
                setLoading(false);
                return;
            }
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${v}`,
                {signal: newController.signal}
            );
            if (response.ok) {
                response.json().then((data) => {
                    if (data.length > 0) {
                        // const {lat, lon} = data[0];
                        mks.current.clearCandMarkers();
                        const res = [];
                        data.forEach((v, i, a) => {
                            res.push(v['display_name']);
                            mks.current.addCandMarker(parseFloat(v['lat']), parseFloat(v['lon']));
                        });
                        setSuggestedLocations(res);
                    } else {
                        console.warn(`No result on ${v}`)
                    }
                })
            } else {
                console.error('Nominatim search failed.');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error during Nominatim search:', error);
        }
    };

    return <Autocomplete sx={{zIndex: 'snackbar'}} loading={loading} loadingText={"Searching..."} startDecorator={<SearchIcon/>}
                         placeholder={'Find a location...'} onInputChange={handleSearch}
                         options={suggestedLocations} isOptionEqualToValue={(option, value) => option.value === value.value} endDecorator={
        loading ? (
            <CircularProgress size="sm" sx={{bgcolor: 'background.surface'}}/>
        ) : null
    }/>;
};

function ChangeView({center,zoom}){
    const map=useMap();
    map.setView(center,zoom);
}

export default function UMap() {
    const markersRef = useRef(null);
    const [focus, setFocus]=useState([37.334835049999995,-122.01139165956805]);
    const zoom=13;
    const sf=(a)=>{setFocus(a);console.log(`triggered focus update, new focus is ${focus}`);};
    return (
        <Sheet>
            <MapContainer style={{height: '100vh', width: '100vw',}} sx={{ zIndex: 'fab'}} center={focus} zoom={zoom}
                          scrollWheelZoom={false}>
                <ChangeView center={focus} zoom={zoom}/>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Markers ref={markersRef} focusUpdater={sf}/>
                <MapClickHandler mks={markersRef}/>
            </MapContainer>
            <Sheet sx={{position: 'absolute', top: '20px', left: '10vw', zIndex: 'modal'}}>
                <SimulateClick />
                <LocationSearch mks={markersRef}/>
            </Sheet>
        </Sheet>
    );
};
