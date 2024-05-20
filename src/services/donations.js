const { getProfileById } = require('../models/profiles');
const { createDonation } = require('../models/donations');
const { NotFoundError, BadRequestError } = require('../utils/errors');


const createDonationAndChargeCard = (donation) => {
    const newDonation = createDonation(donation);
    // charge card here

    return newDonation;
};

const createDonationForProfileId = (donation, profileId) => {
    const profile = getProfileById(profileId);
    if (!profile) {
        throw new NotFoundError('Profile not found');
    }

    return createDonationAndChargeCard({ ...donation, profileId });
};

const createDonationForCampaign = (donation) => {
    const profile = getProfileById(donation.profileId);

    if (!profile) {
        throw new NotFoundError('Campaign profile not found');
    }

    if (profile.parentId) {
        throw new BadRequestError('Profile is not a campaign profile');
    }

    return createDonationAndChargeCard(donation);
};

module.exports = {
    createDonationForProfileId,
    createDonationForCampaign
};