const express = require('express');
const Joi = require('joi');

const router = express.Router();
const donationsController = require('../controllers/donations');
const { validateBody } = require('../middlewares/validator');
const { acceptedConversionRates } = require('../utils/convertRates');

router.post('/',
    validateBody(
        Joi.object(
            {
                profileId: Joi.string().guid({ version: 'uuidv4' }).required(),
                donorName: Joi.string().required(),
                amount: Joi.number().integer().required(),
                currency: Joi.string().valid(...acceptedConversionRates).required(),
            }
        )
    ),
    donationsController.createCampaignDonation);

module.exports = router;