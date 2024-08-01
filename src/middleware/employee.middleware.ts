import {body} from 'express-validator'
//verifying non empty users fields
export const employeeValidator = [
  body('name', 'Invalid does not Empty').not().isEmpty(),
  body('email','Inavalid does not Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'password does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
  body('poste', 'poste does not Empty').not().isEmpty(),
  body('salary',  'salary does not Empty').not().isEmpty(),
]