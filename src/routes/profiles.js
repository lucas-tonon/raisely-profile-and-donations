const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profiles');
const { validatePathParams, validateBody } = require('../middlewares/validator');
const Joi = require('joi');
const asyncHandler = require('../middlewares/asyncHandler');

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
    asyncHandler(profilesController.fetchDonationsByProfileId)
);

router.post(
    '/:profile/donations',
    validatePathParams(
        Joi.object(
            {
                profile: Joi.string().guid({ version: 'uuidv4' }).required()
            }
        )
    ),
    validateBody(
        Joi.object(
            {
                donorName: Joi.string().required(),
                amount: Joi.number().integer().required(),
                currency: Joi.string().valid('USD', 'AUD', 'EUR').required(),
            }
        )
    ),
    asyncHandler(profilesController.createDonationForProfileId)
);

module.exports = router;