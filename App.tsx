import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroARSceneNavigator,
  ViroMaterials,
  Viro3DObject,
  ViroARPlaneSelector,
} from '@viro-community/react-viro';
import Geolocation from 'react-native-geolocation-service';
// import reactNativeGeoFencing from 'react-native-geo-fencing';

ViroMaterials.createMaterials({
  WatMaterial: {
    shininess: 2.0,
    diffuseTexture: require('./assets/14.35719369,100.56787514.png'),
  },
});
const HelloWorldSceneAR = () => {
  const [text, setText] = useState('Initializing AR...');
  // const [isInsidePolygon, setIsInsidePolygon] = useState(false);

  // const getCurrentLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     async position => {
  //       let point = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };

  //       console.log(point);

  //       const lat = position.coords.latitude;
  //       const lng = position.coords.longitude;

  //       const squareSize = 0.001;
  //       const polygon = [
  //         {lat: lat + squareSize, lng: lng + squareSize},
  //         {lat: lat + squareSize, lng: lng - squareSize},
  //         {lat: lat - squareSize, lng: lng - squareSize},
  //         {lat: lat - squareSize, lng: lng + squareSize},
  //         {lat: lat + squareSize, lng: lng + squareSize},
  //       ];

  //       try {
  //         await reactNativeGeoFencing.containsLocation(point, polygon);
  //         console.log('point is within polygon');
  //         setIsInsidePolygon(prevState => {
  //           if (!prevState) {
  //             console.log('Setting isInsidePolygon to true');
  //           }
  //           return true;
  //         });
  //       } catch (error) {
  //         console.log('point is NOT within polygon');
  //         setIsInsidePolygon(prevState => {
  //           if (prevState) {
  //             console.log('Setting isInsidePolygon to false');
  //           }
  //           return false;
  //         });
  //       }
  //     },
  //     error => {
  //       console.error('Error:', error);
  //     },
  //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //   );
  // };

  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  function onInitialized(state: any, reason: any) {
    console.log('guncelleme', state, reason);
    setText('Hello World!');
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroARPlaneSelector>
        <ViroText
          text={text}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, 0]}
          style={styles.helloWorldTextStyle}
        />

        {/* {isInsidePolygon && ( */}
        <Viro3DObject
          source={require('./assets/sphere.obj')}
          position={[0, 0, 0]}
          scale={[5, 5, 5]} // Adjust scale as needed
          type="OBJ"
          materials={['WatMaterial']}
        />
        {/* )} */}
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
