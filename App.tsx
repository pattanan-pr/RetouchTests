/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroARSceneNavigator,
  ViroMaterials,
  Viro3DObject,
  ViroARPlaneSelector,
} from '@viro-community/react-viro';
import Geolocation from 'react-native-geolocation-service';
import reactNativeGeoFencing from 'react-native-geo-fencing';
import Slider from '@react-native-community/slider';

ViroMaterials.createMaterials({
  WatMaterial: {
    shininess: 2.0,
    diffuseTexture: require('./assets/wat.png'),
  },
});

const HelloWorldSceneAR = ({sliderValue}) => {
  const [text, setText] = useState('Initializing AR...');
  const [isInsidePolygon, setIsInsidePolygon] = useState(false);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        let point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const squareSize = 0.001;
        const polygon = [
          {lat: lat + squareSize, lng: lng + squareSize},
          {lat: lat + squareSize, lng: lng - squareSize},
          {lat: lat - squareSize, lng: lng - squareSize},
          {lat: lat - squareSize, lng: lng + squareSize},
          {lat: lat + squareSize, lng: lng + squareSize},
        ];

        try {
          await reactNativeGeoFencing.containsLocation(point, polygon);
          console.log('point is within polygon');
          setIsInsidePolygon(prevState => {
            if (!prevState) {
              console.log('Setting isInsidePolygon to true');
            }
            return true;
          });
        } catch (error) {
          console.log('point is NOT within polygon');
          setIsInsidePolygon(prevState => {
            if (prevState) {
              console.log('Setting isInsidePolygon to false');
            }
            return false;
          });
        }
      },
      error => {
        console.error('Error:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, [sliderValue]);
  useEffect(() => {
    // Handle any logic you want to perform when sliderValue changes
    console.log('Slider Value has changed:', sliderValue);
  }, [sliderValue]);

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

        {isInsidePolygon && (
          <Viro3DObject
            source={require('./assets/sphere.obj')}
            position={[0, 0, 0]}
            scale={[5, 5, 5]} // Adjust scale as needed
            type="OBJ"
            materials={['WatMaterial']}
            opacity={sliderValue}
          />
        )}
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

export default () => {
  const [sliderValue, setSliderValue] = useState(1);
  console.log('Slider Value:', sliderValue);
  const [sceneKey, setSceneKey] = useState(0);

  useEffect(() => {
    // Use a functional update to avoid the warning
    setSceneKey(prevSceneKey => prevSceneKey + 1);
    console.log('i re render');
  }, [sliderValue]);

  const [forceUpdate, setForceUpdate] = useState(0);

  const handleForceUpdate = () => {
    setForceUpdate(prevForceUpdate => prevForceUpdate + 1);
  };
  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: props => (
            <HelloWorldSceneAR
              {...props}
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
            />
          ),
          sceneKey: sceneKey,
        }}
        style={styles.arScene}
      />
      <Slider
        style={{width: '80%', alignSelf: 'center'}}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
        value={sliderValue}
        onValueChange={value => setSliderValue(value)}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          marginHorizontal: 80,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleForceUpdate}>
        <Text style={{color: '#fff', fontWeight: '600'}}>
          Force Update Components
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arScene: {
    flex: 1,
  },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
