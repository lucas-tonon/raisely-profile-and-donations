const express = require('express');
const Joi = require('joi');

const router = express.Router();
const donationsController = require('../controllers/donations');
const asyncHandler = require('../middlewares/asyncHandler');
const { validateBody } = require('../middlewares/validator');
const { acceptedConversionRates } = require('../utils/convertRates');

router.post('/',
    validateBody(
        Joi.object(
            {
                profileId: Joi.string().guid({ version: 'uuidv4' }).required(),
                donorName: Joi.string().required(),
                amount: Joi.number().integer().prefs({ convert: false }).required(),
                currency: Joi.string().valid(...acceptedConversionRates).required(),
            }
        )
    ),
    asyncHandler(donationsController.createCampaignDonation));

module.exports = router;