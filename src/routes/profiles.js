const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profiles');
const { validatePathParams, validateBody } = require('../middlewares/validator');
const Joi = require('joi');

router.get('/', profilesController.fetchAllProfiles);

router.get(
    '/:profile/donations',
    validatePathParams(
        Joi.object(
            {
                profile: Joi.string().guid({ version: 'uuidv4' }).required()
            }
        )
    ),
    profilesController.fetchDonationsByProfileId
);


module.exports = router;