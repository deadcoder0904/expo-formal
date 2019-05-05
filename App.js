import useFormal from '@kevinwolf/formal-native'
import React from 'react'
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native'
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
    .required(),
  'Confirm Password': yup
    .string()
    .oneOf([yup.ref('Password'), null], "Passwords don't match")
    .required(),
})

const initialValues = {
  Username: 'tonystark',
  Email: 'tonystark@avengers.io',
  Password: 'avengers',
  'Confirm Password': 'avengers',
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
    onSubmit: values => {
      const username = values['Username']
      const email = values['Email']
      const password = values['Password']
      const confirmPass = values['Confirm Password']
      fetch('http://localhost:1337/form', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPass }),
      })
        .then(res => res.json())
        .then(data => {
          Alert.alert(JSON.stringify(data))
        })
        .catch(err => {
          Alert.alert(JSON.stringify(err))
        })
    },
  })

  return (
    <SafeAreaView>
      <View style={styles.space}>
        <Text h1>Formal</Text>
        <Field {...formal.getFieldProps('Username')} placeholder="Username" />
        <Field {...formal.getFieldProps('Email')} placeholder="Email" />
        <Field
          {...formal.getFieldProps('Password')}
          placeholder="Password"
          secureTextEntry
        />
        <Field
          {...formal.getFieldProps('Confirm Password')}
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
