const donationsService = require('../services/donations');
const profilesService = require('../services/profiles');

/**
 * Fetch all profiles
 */
const fetchAllProfiles = (_req, res) => {
    res.json(profilesService.fetchProfiles());
};

/**
 * Fetch a single profile's donations
 */
const fetchDonationsByProfileId = (req, res) => {
    const profileId = req.params.profile;
    res.json(profilesService.fetchDonationsByProfileId(profileId));
};

/**
 * Submit a new donation to the profile with the given ID
 */
const createDonationForProfileId = (req, res) => {
    const profileId = req.params.profile;
    const { donorName, amount, currency } = req.body;

    const newDonation = donationsService.createDonationForProfileId({ donorName, amount, currency }, profileId);
    res.status(201).json(newDonation);
};

module.exports = {
    createDonationForProfileId,
    fetchAllProfiles,
    fetchDonationsByProfileId
};