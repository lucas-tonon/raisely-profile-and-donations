const { getProfileById, updateTotalForCampaignProfile, getProfiles, updateTotalForProfiles } = require('../models/profiles');
const { createDonation } = require('../models/donations');

const { convertAmountToTargetCurrency } = require('../utils/convertRates');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const { profileAndParentsTotalUpdateCache, buildProfileAndParentsTotalUpdateCache } = require('../utils/cache');

const updateTotalForProfileAndItsParents = (donation, profileId) => {
    let profilesForTotalUpdate = profileAndParentsTotalUpdateCache[profileId];
    if (profilesForTotalUpdate === undefined) {
        const profiles = getProfiles();
        profilesForTotalUpdate = buildProfileAndParentsTotalUpdateCache(profiles, profileId);
    }

    // Update total for all profiles with the correct currency * amount
    for (let profile of profilesForTotalUpdate) {
        profile.total += convertAmountToTargetCurrency(donation.amount, donation.currency, profile.currency);
    }

    updateTotalForProfiles(profilesForTotalUpdate);
};

const createDonationForProfileId = (donation, profileId) => {
    const profile = getProfileById(profileId);
    if (!profile) {
        throw new NotFoundError('Profile not found');
    }

    // charge card here

    updateTotalForProfileAndItsParents(donation, profileId);
    return createDonation({ ...donation, profileId });
};

const createDonationForCampaign = (donation) => {
    const profile = getProfileById(donation.profileId);

    if (!profile) {
        throw new NotFoundError('Profile not found');
    }

    if (profile.parentId) {
        throw new BadRequestError('Profile is not a campaign profile');
    }

    // charge card here

    const convertedAmount = convertAmountToTargetCurrency(donation.amount, donation.currency, profile.currency);
    const newTotal = profile.total + convertedAmount;
    updateTotalForCampaignProfile(donation.profileId, newTotal);

    return createDonation(donation);
};

module.exports = {
    createDonationForProfileId,
    createDonationForCampaign
};