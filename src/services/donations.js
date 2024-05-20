const { getProfileById } = require('../models/profiles');
const { createDonation } = require('../models/donations');

const createDonationForProfileId = (donation, profileId) => {
    const profile = getProfileById(profileId);
    if (!profile) {
        throw new Error('Profile not found');
    }

    const newDonation = createDonation({ ...donation, profileId });

    // charge card here

    return newDonation;
};

const createDonationForCampaign = (_donation) => {
    // Your implementation here
};

module.exports = {
    createDonationForProfileId,
    createDonationForCampaign
};