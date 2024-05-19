const express = require('express');
const router = express.Router();
const profilesController = require('../controllers/profiles');

router.get('/', profilesController.fetchAllProfiles);
router.get('/:profile/donations', profilesController.fetchDonationsByProfile);
router.post('/:profile/donations', profilesController.createDonationForProfile);

module.exports = router;