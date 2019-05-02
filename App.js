import useFormal from '@kevinwolf/formal-native'
import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'
import * as yup from 'yup'

const schema = yup.object().shape({
  Username: yup.string().required(),
  Email: yup
    .string()
    .email('Invalid Email Address')
    .required(),
  Password: yup
    .string()
    .min(4)
    .max(32)
    .matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]$')
    .required(),
  ConfirmPassword: yup
    .string()
    .oneOf([yup.ref('Password'), null], "Passwords don't match")
    .required(),
})

const initialValues = {
  Username: 'tonystark',
  Email: 'tonystark@avengers.io',
  Password: 'avengers',
  ConfirmPassword: 'avengers',
}

const Field = ({ placeholder, error, ...props }) => (
  <>
    <Text style={styles.space}>{placeholder}</Text>
    <Input {...props} />
    {error && (
      <Text style={[styles.space, error && styles.error]}>{error}</Text>
    )}
  </>
)

function App() {
  const formal = useFormal(initialValues, {
    schema,
    onSubmit: values => Alert.alert(JSON.stringify(values)),
  })

  return (
    <SafeAreaView>
      <View style={styles.space}>
        <StatusBar hidden />
        <Text h1>Formal</Text>
        <Field {...formal.getFieldProps('Username')} placeholder="Username" />
        <Field {...formal.getFieldProps('Email')} placeholder="Email" />
        <Field
          {...formal.getFieldProps('Password')}
          placeholder="Password"
          secureTextEntry
        />
        <Field
          {...formal.getFieldProps('ConfirmPassword')}
          placeholder="Confirm Password"
          secureTextEntry
        />
        <Button
          style={styles.space}
          {...formal.getSubmitButtonProps()}
          disabled={false}
          title="Submit"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  space: {
    margin: 10,
  },
  error: {
    color: 'red',
  },
})

export default App
