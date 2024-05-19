const profilesService = require('../services/profiles');

/**
 * Fetch all profiles
 */
const fetchAllProfiles = (req, res) => {
    res.json(profilesService.fetchProfiles());
};

/**
 * Fetch a single profiles donations
 */
const fetchDonationsByProfile = (_req, _res) => {
    // Your implementation here
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
    fetchDonationsByProfile
};