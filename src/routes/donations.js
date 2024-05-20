const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donations');
const { validateBody } = require('../middlewares/validator');
const Joi = require('joi');

router.post('/',
    validateBody(
        Joi.object(
            {
                profileId: Joi.string().guid({ version: 'uuidv4' }).required(),
                donorName: Joi.string().required(),
                amount: Joi.number().integer().required(),
                currency: Joi.string().valid('USD', 'AUD', 'EUR').required(),
            }
        )
    ),
    donationsController.createCampaignDonation);

module.exports = router;