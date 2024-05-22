const { getProfiles, getProfileById } = require('../models/profiles');
const { getDonationsByProfileId } = require('../models/donations');
const { NotFoundError } = require('../utils/errors');

/**
 * Retrieves all existing profiles
 * @returns Array of existing profiles
 */
const fetchProfiles = () => {
    return getProfiles();
};

/**
 * Retrieves all donations made to a specific profileId
 * @param {*} profileId
 * @returns Array of donations to profile
 */
const fetchDonationsByProfileId = (profileId) => {
    const profile = getProfileById(profileId);

    if (!profile) {
        throw new NotFoundError('Profile not found');
    }

    return getDonationsByProfileId(profileId);
};

module.exports = {
    fetchProfiles,
    fetchDonationsByProfileId
};