const { getProfiles } = require('../models/profiles');

const fetchProfiles = () => {
    return getProfiles();
};

module.exports = {
    fetchProfiles
};