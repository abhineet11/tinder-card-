import React from 'react';
import { StyleSheet, Text, View, Image, PanResponder, Animated, Dimensions } from 'react-native';
import moment from 'moment'

const {width, height} = Dimensions.get('window')

export default class Card extends React.Component {
  componentWillMount() {
    this.pan = new Animated.ValueXY()
    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {dx: this.pan.x, dy: this.pan.y}
      ]) ,
      onPanResponderRelease: (e, {dx}) => {
        const absDx = Math.abs(dx);
        const direction = absDx/dx;
        if(absDx > 120) {
            Animated.decay(this.pan, {
                velocity: {x: 3*direction, y: 0},
                deceleration: 0.995
            }).start()
        }else {
            Animated.spring(this.pan, {
                toValue: {x:0, y:0}, 
                friction:4.5
              }).start()
        }
        
      }
    })
  }

  render() {
    const {id, name, bio, birthday} = this.props;  
    const profileBday = moment(birthday, 'MM/DD/YYYY');
    const profileAge = moment().diff(profileBday, 'years')
    const fbImage = `https://graph.facebook.com/${id}/picture?height=500`

    const rotateCard = this.pan.x.interpolate({
      inputRange: [-200, 0 , 200 ],
      outputRange: ['10deg', '0deg', '-10deg']
    })

    const animateStyle = {
      transform: [
        {translateX: this.pan.x},
        {translateY: this.pan.y},
        {rotate: rotateCard}
      ]
    }
    return (
      <Animated.View style={[styles.card, animateStyle]} {...this.cardPanResponder.panHandlers}>
        <Image 
          source= {{uri: fbImage}}
          style={{flex: 1}}
        />
        <View style={{margin: 20}}>
         <Text style={{fontSize:20}}>{name}, {profileAge}</Text>
          <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    position: 'absolute',
    width: width-20,
    height:height*0.7,
    top: (height*0.3)/2,
    backgroundColor: '#fff',
    margin: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8
  },
});
