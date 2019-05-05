const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { check, validationResult } = require('express-validator/check')

app.use(bodyParser.json())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ lol: true })
})

app.post(
  '/form',
  [
    check('username')
      .not()
      .isEmpty(),
    check('email')
      .isEmail()
      .withMessage('Invalid Email Address'),
    check('password')
      .isLength({ min: 4 })
      .withMessage('Password must be at least 4 characters')
      .isLength({ max: 32 })
      .withMessage('Password must be atmost 32 characters')
      .custom((value, { req }) => {
        if (value !== req.body.confirmPass) {
          throw new Error("Passwords don't match")
        } else {
          return value
        }
      }),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { username, email, password } = req.body
    //TODO: create user with the above data
    res.json({ success: true })
  },
)

app.listen(1337, () => console.log(`Server running on port 1337!`))
