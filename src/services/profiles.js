const { getProfiles, getProfileById } = require('../models/profiles');
const { getDonationsByProfileIds } = require('../models/donations');
const { convertAmountToTargetCurrency } = require('../utils/convertRates');
const { profilesAdjacencyListCache, buildProfilesAdjacencyListCache, getProfileIdsFromSubtree } = require('../utils/profilesTreeCache');

const fetchProfiles = () => {
    return getProfiles();
};

const fetchDonationsByProfileId = (profileId) => {
    const profile = getProfileById(profileId);

    if (!Object.keys(profilesAdjacencyListCache).length) {
        buildProfilesAdjacencyListCache(getProfiles());
    }

    const profileIds = getProfileIdsFromSubtree(profileId);
    const donations = getDonationsByProfileIds(profileIds);

    // Convert donation amount to profile's currency type
    for (let donation of donations) {
        if (donation.currency === profile.currency) continue;

        donation.amount = convertAmountToTargetCurrency(donation.amount, donation.currency, profile.currency);
        donation.currency = profile.currency;
    }

    return donations;
};

module.exports = {
    fetchProfiles,
    fetchDonationsByProfileId
};