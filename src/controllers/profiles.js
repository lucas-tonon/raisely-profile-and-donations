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
const createDonationForProfile = (_req, _res) => {
    // Your implementation here
};

module.exports = {
    createDonationForProfile,
    fetchAllProfiles,
    fetchDonationsByProfileId
};