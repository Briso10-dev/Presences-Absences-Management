import {body} from 'express-validator'
//verifying non empty employee fields
export const employeeValidator = [
  body('name', 'Invalid does not Empty').not().isEmpty(),
  body('email','Inavalid does not Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'password does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
  body('post', 'poste does not Empty').not().isEmpty(),
  body('salary',  'salary does not Empty').not().isEmpty(),
]
// verifying non-empy starting hour
export const presenceStartValidator = [
  body('startingHour', 'Invalid does not Empty').not().isEmpty(),
  body('startingHour', 'Invalid DateTime format').toDate(),
]
// verifying non-empty ending hour
export const presenceEndValidator = [
  body('endingHour', 'Invalid does not Empty').not().isEmpty(),
  body('endingHour', 'Invalid DateTime format').toDate(),
]