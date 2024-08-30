import React, {useMemo, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {LOCATION, USER} from './images';
import {useNavigation} from '@react-navigation/native';
import {CLUSTERED_MAP} from '../navigation/routeNames.ts';
import styles from './styles.ts';
import MappableMap, {
  Point,
  CameraPosition,
  Animation,
  Circle,
  Polygon,
  Search,
  Marker,
} from 'react-native-mappable';
import ButtonsBlock from './ButtonsBlock.tsx';
import Mappable from 'react-native-mappable';

const MapWithPrimitives = () => {
  const [marker, setMarker] = useState<Point>();
  const [polyline, setPolyline] = useState<Point[]>([]);
  const [night, setNight] = useState(false);
  const [address, setAddress] = useState('');

  const navigation = useNavigation();

  const map = useRef<Mappable>(null);

  const getCurrentPosition = () => {
    return new Promise<CameraPosition>(resolve => {
      if (map.current) {
        map.current.getCameraPosition(position => {
          resolve(position);
        });
      }
    });
  };

  const zoomUp = async () => {
    const position = await getCurrentPosition();
    if (map.current) {
      map.current.setZoom(position.zoom * 1.1, 0.1);
    }
  };

  const zoomDown = async () => {
    const position = await getCurrentPosition();
    if (map.current) {
      map.current.setZoom(position.zoom * 0.9, 0.1);
    }
  };

  const onMapLongPress = async (event: NativeSyntheticEvent<Point>) => {
    const {lat, lon} = event.nativeEvent;
    const newMarker = {
      lat,
      lon,
    };
    setMarker(newMarker);
    setAddress('');
    const geoAddress = await Search.geocodePoint(newMarker);

    if (geoAddress) {
      setAddress(geoAddress.formatted);
    }
  };

  const onMarkerPress = () => {
    setMarker(undefined);
  };

  const onMapPress = (event: NativeSyntheticEvent<Point>) => {
    const {lat, lon} = event.nativeEvent;
    const newPolyline = [
      ...polyline,
      {
        lat,
        lon,
      },
    ];
    setPolyline(newPolyline);
  };

  const zoomToMarker = () => {
    if (map.current && marker) {
      map.current.setCenter({...marker}, 14, 0, 0, 0.4, Animation.LINEAR);
    }
  };

  const clear = () => {
    setMarker(undefined);
    setPolyline([]);
    setAddress('');
  };

  const toggleNightMode = () => {
    setNight(prevState => !prevState);
  };

  const markerPoint = useMemo(
    () =>
      marker ? (
        <>
          <Marker
            key={marker.lat}
            onPress={onMarkerPress}
            source={LOCATION}
            point={marker}
          />
          <Circle
            center={marker}
            radius={300}
            fillColor="#ff000080"
            strokeColor={'#ffff00'}
          />
        </>
      ) : null,
    [marker],
  );

  return (
    <View style={styles.container}>
      <MappableMap
        ref={map}
        style={styles.container}
        userLocationIcon={USER}
        userLocationIconScale={2}
        userLocationAccuracyStrokeColor={'#fff'}
        userLocationAccuracyStrokeWidth={1.5}
        userLocationAccuracyFillColor={'#ff000080'}
        showUserPosition
        onMapPress={onMapPress}
        nightMode={night}
        onMapLongPress={onMapLongPress}>
        {markerPoint}
        {polyline.length > 2 && (
          <Polygon
            points={polyline}
            onPress={() => setPolyline([])}
            strokeWidth={2}
            fillColor="#00ff0080"
          />
        )}
      </MappableMap>
      <View style={styles.addressWrapper}>
        <SafeAreaView />
        <View style={styles.address}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(CLUSTERED_MAP as never);
            }}>
            <Text style={styles.navigationText}>To the map with clusters</Text>
          </TouchableOpacity>
        </View>
      </View>
      {address && marker ? (
        <View style={styles.addressWrapper}>
          <SafeAreaView />
          <View style={styles.address}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
        </View>
      ) : null}
      <ButtonsBlock
        night={night}
        marker={marker}
        zoomToMarker={zoomToMarker}
        toggleNightMode={toggleNightMode}
        clear={clear}
        zoomUp={zoomUp}
        zoomDown={zoomDown}
      />
    </View>
  );
};

export default MapWithPrimitives;
