import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableHighlight } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
Amplify.configure({
  Auth: {
    userPoolId: '<PoolId>',
    userPoolWebClientId: '<WebClientId>',
  }
})

export default function SignIn() {

  const [phoneNumber, setPhoneNumber] = useState();
  const [otp, setOtp] = useState();
  const [user, setUser] = useState();
  const [showSignUp, setSignUpFlag] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrMessage] = useState('');

  const handleSignUp = () => {
    setMessage('');
    setErrMessage('');
    Auth.signUp({
      username: phoneNumber,
      password: "Testt@1234",
    }).then((signup) => {
      console.log('SignUp Response: ', signup);
      setErrMessage('');
      setMessage("User is created successfully")
    }).catch(error => {
      setMessage('');
      setErrMessage('Sign up failed')
      console.log('SignUp Error: ', error);
    });
  }
  const sendOTP = () => {
    console.log("inside" + JSON.stringify(phoneNumber));
    setMessage('');
    setErrMessage('');
    Auth.signIn(phoneNumber).then((signInUser) => {
      setUser(signInUser);
      setMessage("Please enter the OTP sent to your mobile")
      console.log("signInUser" + JSON.stringify(user))
    }).catch(error => {
      console.log('SignIn Error: ', error);
      setErrMessage('Failed to send OTP')
    });
  }

  onSubmit = function () {
    console.log("otp:" + otp)
    setMessage('');
    setErrMessage('');
    Auth.sendCustomChallengeAnswer(user, otp)
      .then((response) => {
        console.log(response);
        setMessage('User logged in successfully')
      }).catch(error => {
        setErrMessage('user Sign in failed')
        console.log('Challenge Error', error);
      });
  }

  const changeScreen = (e) => {
    setSignUpFlag(!showSignUp);
    setMessage('');
    setPhoneNumber('');
    setOtp('');
    setErrMessage('');
  }
  return (
    <View style={styles.container}>

      <Text style={{
        color: "#229954",
        paddingBottom: 10,
        fontSize: 15
      }
      }>{message}</Text>
      <Text style={{
        color: "#E74C3C",
        paddingBottom: 10,
        fontSize: 15
      }
      }>{errorMessage}</Text>
      {showSignUp ?
        <>
          <Text h1 style={{ color: "#212F3D", paddingBottom: 10, fontSize: 30, margin: 10 }}>SIGN UP</Text>

          <TextInput
            style={{
              height: 40,
              width: 200,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 8,
              marginBottom: 10,
              backgroundColor: 'white'


            }}
            name="phoneNumber"
            placeholder="Eg:+911223434567"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            type="text"
          />
          <TouchableHighlight
            style={{
              height: 40,
              width: 100,
              borderRadius: 10,
              marginLeft: 50,
              marginRight: 50,
              marginTop: 20
            }}>
            <Button
              color='#48C9B0'

              onPress={handleSignUp}
              title="SignUp" />
          </TouchableHighlight>

        </>
        :
        <>
          <Text h1 style={{ color: "#212F3D", paddingBottom: 10, fontSize: 30, margin: 10 }}>SIGN IN</Text>
          <TextInput
            style={{
              height: 40,
              width: 200,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 8,
              marginBottom: 10,
              backgroundColor: 'white'

            }}
            name="phoneNumber"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            type="otp"
          />
          <Button style={{
            paddingBottom: 10,
            marginBottom: 10,
            marginTop: 10

          }}
            color='#3498DB'
            onPress={sendOTP}
            title="Send OTP" />
          <TextInput
            style={{
              height: 40,
              width: 200,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 8,
              paddingTop: 8,
              paddingLeft: 8,
              marginBottom: 10,
              marginTop: 10,
              backgroundColor: 'white'

            }}
            placeholder="Enter OTP"
            name="otp"
            value={otp}
            onChangeText={text => setOtp(text)}
            type="number"
          />


          <TouchableHighlight
            style={{
              height: 40,
              width: 160,
              borderRadius: 10,
              marginLeft: 50,
              marginRight: 50,
              marginTop: 20
            }}>
            <Button
              title="Submit"
              type="submit"
              color="#48C9B0"
              onPress={onSubmit} />

          </TouchableHighlight>
        </>
      }
      <TouchableHighlight
        style={{
          height: 40,
          width: 100,
          borderRadius: 10,
          marginLeft: 50,
          marginRight: 50,
          marginTop: 20
        }}>
        <Button
          title={showSignUp ? "SignIn" : "SignUp"}
          type="outline"
          color="#283747"
          onPress={changeScreen}></Button>

      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#CACFD2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    color: "black",
    height: 50,
    margin: 50,
    marginTop: 120,
    marginBottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#D0D3D4',
    borderColor: "#B3B6B7",
    borderWidth: 3,
    borderRadius: 3
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
