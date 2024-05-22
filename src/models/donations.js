const { v4: uuidv4 } = require('uuid');

const { donations } = require('../database/db');

const getDonationsByProfileId = (profileId) => {
  return donations.filter(d => d.profileId === profileId);
};

const createDonation = (donation) => {
  const newDonation = { ...donation, id: uuidv4() };
  donations.push(newDonation);

  return newDonation;
};

module.exports = {
  getDonationsByProfileId,
  createDonation
};