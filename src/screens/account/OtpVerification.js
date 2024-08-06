import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {OtpInput} from 'react-native-otp-entry';

const OtpVerification = () => {
  const [otp, setOtp] = React.useState('');
  const [timer, setTimer] = React.useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 0) {
          clearInterval(interval);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pressHandler = () => {
    setTimer(60);
    console.log('resend');
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.head}>
          We have sent a verification code to your mobile number.
        </Text>
        <View style={{width: '90%', marginTop: 20}}>
          <OtpInput
            numberOfDigits={6}
            onTextChange={setOtp}
            autoFocus={true}
            textInputProps={{
              accessibilityLabel: 'One-Time Password',
            }}
            theme={{
              pinCodeTextStyle: {color: '#273567'},
              pinCodeContainerStyle: {
                borderWidth: 0,
                borderBottomColor: '#9EA4AA',
                borderBottomWidth: 1,
              },
              filledPinCodeContainerStyle: {borderBottomColor: '#273567'},
            }}
            focusColor={'#273567'}
          />
        </View>
        <View style={styles.resendContainer}>
          <Text style={styles.timer}>{timer}</Text>
          <Pressable disabled={timer !== 0} onPress={pressHandler}>
            <Text style={styles.resend}>Resend OTP</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#185389',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  head: {
    color: '#9EA4AA',
    fontSize: 14,
    fontWeight: '400',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  timer: {
    color: '#9EA4AA',
    fontSize: 12,
    fontWeight: '500',
  },
  resend: {
    color: '#334EAC',
    fontSize: 12,
    fontWeight: '600',
  },
});
