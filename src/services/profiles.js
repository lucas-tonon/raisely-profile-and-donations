const { getProfiles, getProfileById } = require('../models/profiles');
const { getDonationsByProfileId } = require('../models/donations');
const { NotFoundError } = require('../utils/errors');

const fetchProfiles = () => {
    return getProfiles();
};

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