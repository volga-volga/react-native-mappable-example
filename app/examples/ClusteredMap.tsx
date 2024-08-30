import React, {useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraPosition,
  ClusteredMappable,
  Marker,
  Point,
} from 'react-native-mappable';
import ButtonsBlock from './ButtonsBlock';
import {useNavigation} from '@react-navigation/native';
import {BLACK} from '../assets';
import styles from './styles';

// Mappable.init(MAP_KEY);

const ClusteredMap = () => {
  const map = useRef<ClusteredMappable>(null);
  const [markers, setMarkers] = useState<Point[]>([]);
  const navigation = useNavigation();

  const onMapPress = (event: NativeSyntheticEvent<Point>) => {
    const {lat, lon} = event.nativeEvent;
    const newPolyline = [
      ...markers,
      {
        lat,
        lon,
      },
    ];
    setMarkers(newPolyline);
  };

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

  const clear = () => {
    setMarkers([]);
  };

  return (
    <View style={{flex: 1}}>
      <ClusteredMappable
        clusterColor={'red'}
        clusteredMarkers={markers.map(marker => ({data: {}, point: marker}))}
        ref={map}
        onMapPress={onMapPress}
        renderMarker={(info, index) => (
          <Marker key={index} point={info.point}>
            <View style={styles.clusterMarker} />
          </Marker>
        )}
        showUserPosition={false}
        style={{flex: 1}}
        userLocationIcon={BLACK}
      />
      <View style={styles.addressWrapper}>
        <SafeAreaView />
        <View style={styles.address}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={styles.navigationText}>
              To the map with primitives
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ButtonsBlock clear={clear} zoomUp={zoomUp} zoomDown={zoomDown} />
    </View>
  );
};

export default ClusteredMap;
