const { v4: uuidv4 } = require('uuid');

const { donations } = require('../database/db');

// SELECT * from donations;
const getDonations = () => {
  return donations;
};

// SELECT * from donations where profileId IN (<profileIds>);
const getDonationsByProfileIds = (profileIds) => {
  // Creating a map to allow O(n) filtering by keys (instead of array1.filter(elem => array2.includes(elem)))
  const queryProfileIdsMap = profileIds.reduce((a, v) => ({ ...a, [v]: true }), {});

  const donations = getDonations();
  const filteredDonations = [];

  for (let donation of donations) {
    const donationProfileId = donation.profileId;

    if (queryProfileIdsMap[donationProfileId]) {
      filteredDonations.push({ ...donation });
    }
  }

  return filteredDonations;
};

// INSERT INTO donations (donorName, currency, amount, profileId) VALUES (...);
const createDonation = (donation) => {
  const newDonation = { ...donation, id: uuidv4() };
  donations.push(newDonation);

  return newDonation;
};

module.exports = {
  getDonations,
  getDonationsByProfileIds,
  createDonation
};