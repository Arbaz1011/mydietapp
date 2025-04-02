import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet for custom icons
import "./NearbyNutritionShops.css"; // Ensure you have this CSS file for styling

const NearbyNutritionShops = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                fetchNearbyShops(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation Error:", error);
                setError("Failed to retrieve location. Ensure GPS is enabled.");
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    const fetchNearbyShops = async (lat, lon) => {
        const query = `[out:json];
        (
            node["shop"="nutrition"](around:5000,${lat},${lon});
            node["shop"="health_food"](around:5000,${lat},${lon});
            node["shop"="supplements"](around:5000,${lat},${lon});
        );
        out;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            if (!data.elements) throw new Error("No data received");

            const shops = data.elements.map((shop) => ({
                id: shop.id,
                name: shop.tags.name || "Unknown Nutrition Shop",
                lat: shop.lat,
                lon: shop.lon,
            }));

            setShops(shops);
            setLoading(false);
        } catch (error) {
            console.error("API Fetch Error:", error);
            setError("Failed to fetch nearby nutrition shops.");
            setLoading(false);
        }
    };

    // Custom Map Icons
    const userIcon = new L.Icon({
        iconUrl: "https://cdn4.iconfinder.com/data/icons/essentials-72/24/025_-_Location-1024.png",
        iconSize: [54, 54],
        iconAnchor: [27, 54], // Centered horizontally and anchored at the bottom
        popupAnchor: [1, -54], // Offset right above the icon
    });

    const shopIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/4264/4264913.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32], // Centered horizontally and anchored at the bottom
        popupAnchor: [0, -32], // Centered above the icon
    });

    return (
        <div className="nearby-nutrition-shops-container">
            <h2>Nearby Nutrition Shops</h2>
            {loading && <p>Loading map...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="map-wrapper">
                {userLocation && (
                    <MapContainer center={userLocation} zoom={13} className="leaflet-container">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        <Marker position={userLocation} icon={userIcon}>
                            <Popup>📍 You are here</Popup>
                        </Marker>
                        {shops.map((shop) => (
                            <Marker key={shop.id} position={[shop.lat, shop.lon]} icon={shopIcon}>
                                <Popup>{shop.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default NearbyNutritionShops;
