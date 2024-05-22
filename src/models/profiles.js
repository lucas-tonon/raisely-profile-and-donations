const { profiles } = require('../database/db');

const getProfiles = () => {
  return profiles;
};

const getProfileById = (profileId) => {
  return profiles.filter(p => p.id === profileId)[0] || null;
};

const updateTotalForCampaignProfile = (profileId, newTotal) => {
  const selectedProfile = profiles.find(p => p.id === profileId && p.parentId === null);
  if (!selectedProfile) return 0;

  selectedProfile.total = newTotal;
  return 1;
};

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