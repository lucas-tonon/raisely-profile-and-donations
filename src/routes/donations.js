const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donations');

router.post('/', donationsController.createDonationToCampaign);

module.exports = router;