const { v4: uuidv4 } = require('uuid');

const { donations } = require('../database/db');

// SELECT * from donations;
const getDonations = () => {
  return donations;
};

// SELECT * from donations where profileId = <profileId>;
const getDonationsByProfileId = (profileId) => {
  return donations.filter(d => d.profileId === profileId);
};

// INSERT INTO donations (donorName, currency, amount, profileId) VALUES (...);
const createDonation = (donation) => {
  const newDonation = { ...donation, id: uuidv4() };
  donations.push(newDonation);

  return newDonation;
};

module.exports = {
  getDonations,
  getDonationsByProfileId,
  createDonation
};