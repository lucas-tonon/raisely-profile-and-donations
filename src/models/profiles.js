const { profiles } = require('../database/db');

/**
 * Retrieves all existing profiles
 * @returns Array of profiles
 */
const getProfiles = () => {
  return profiles;
};

/**
 * Retrieves profile with given profileId
 * @returns If it exists, returns the profile. If not, returns null
 */
const getProfileById = (profileId) => {
  return profiles.filter(p => p.id === profileId)[0] || null;
};

/**
 * Updates total value for a specific Campaign Profile
 * @param {String} profileId
 * @param {Number} newTotal
 * @returns If it's an existing campaign profile, returns 1, the number of updated records. If not, returns 0
 */
const updateTotalForCampaignProfile = (profileId, newTotal) => {
  const selectedProfile = profiles.find(p => p.id === profileId && p.parentId === null);
  if (!selectedProfile) return 0;

  selectedProfile.total = newTotal;
  return 1;
};

/**
 * Updates the total value for multiple profiles
 * @param {Array} updateProfiles Info to update profiles in a "batch", i.e., values for "id" and new "total"
 * @returns Number of updated records
 */
const updateTotalForProfiles = (updateProfiles) => {
  let numberOfUpdatedRecords = 0;
  let updateProfilesMap = updateProfiles.reduce((a, v) => ({ ...a, [v.id]: v }), {}); // { profileId1: { id: profileId1, total: newTotal }, ... }

  for (let i = 0; i < profiles.length; i++) {
    const currentProfile = profiles[i];
    if (!updateProfilesMap[currentProfile.id]) continue;

    currentProfile.total = updateProfilesMap[currentProfile.id].total;
    numberOfUpdatedRecords++;
  }

  return numberOfUpdatedRecords;
};

module.exports = {
  getProfiles,
  getProfileById,
  updateTotalForCampaignProfile,
  updateTotalForProfiles
};