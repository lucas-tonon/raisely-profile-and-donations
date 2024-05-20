const { profiles } = require('../database/db');

// SELECT * from profiles;
const getProfiles = () => {
  return profiles;
};

// SELECT * from profiles WHERE id = <profileId>;
const getProfileById = (profileId) => {
  return profiles.filter(p => p.id === profileId)[0];
};

module.exports = {
  getProfiles,
  getProfileById
};