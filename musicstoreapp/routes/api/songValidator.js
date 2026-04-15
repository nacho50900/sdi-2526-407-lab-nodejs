const {check, param}= require('express-validator');
const songsRepository = require('express-validator');
const {ObjectId} = require('mongodb');

exports.songValidatorInsert = [
    check('title', 'Title is required').trim().not().isEmpty(),
    check('title', 'Title must be 5 or mor chars').trim().isLength({ min: 5 }),
    check('kind', 'kind is required').trim().not().isEmpty(),
    check('kind', 'kindmust be 3 or mor chars').trim().isLength({ min: 3 }),
    check('price', 'price is required').trim().not().isEmpty(),
    check('price', 'price must eb a number').isNumeric(),
    check('price').custom( value => {
        if (value < 0) {
            throw new Error('price must be greater than zero')
        }
        return true;
    })
    ]

/*
exports.songValidatorUpdate = [
    check('title')
        .if(check('title').exists())
        .trim().isLength({ min: 5 })
        .withMessage('Title must be at least 5 characters long'),


    }

]*/