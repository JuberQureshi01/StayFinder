
import React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY; 

const PropertyMap = ({ longitude, latitude }) => {
    console.log(longitude,latitude);
    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden">
            <Map
                initialViewState={{
                    longitude: longitude,
                    latitude: latitude,
                    zoom: 14
                }}
                style={{width: '100%', height: '100%'}}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <Marker longitude={longitude} latitude={latitude} anchor="bottom" >
                    <MapPin size={32} className="text-[#FF385C]" fill="currentColor" />
                </Marker>
            </Map>
        </div>
    );
};

export default PropertyMap;