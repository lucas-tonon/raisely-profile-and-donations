const profileAndParentsTotalUpdateCache = {};

/**
 * Builds up a cache for the list of parents of a given profileId.
 * The goal of this cache is to be used when updating totals for parents of a profile
 * @param {*} profiles
 * @param {*} profileId
 * @returns profileAndParentsTotalUpdateCache value for the given profileId
 */
const buildProfileAndParentsTotalUpdateCache = (profiles, profileId) => {
    // Build map of profiles for easier access
    const profilesMapById = {};
    for (let profile of profiles) {
        profilesMapById[profile.id] = {
            id: profile.id,
            currency: profile.currency,
            total: profile.total,
            parentId: profile.parentId
        };
    }

    // Initialize cache
    let parentId = profilesMapById[profileId].parentId;
    profileAndParentsTotalUpdateCache[profileId] = [
        {
            id: profileId,
            currency: profilesMapById[profileId].currency,
            total: profilesMapById[profileId].total,
        }
    ];

    // Get parent until reaching Campaign Profile
    while (parentId != null) {
        profileAndParentsTotalUpdateCache[profileId].push(
            {
                id: parentId,
                currency: profilesMapById[parentId].currency,
                total: profilesMapById[parentId].total
            }
        );

        parentId = profilesMapById[parentId].parentId;
    }

    return profileAndParentsTotalUpdateCache[profileId];
};

module.exports = {
    profileAndParentsTotalUpdateCache,
    buildProfileAndParentsTotalUpdateCache
};