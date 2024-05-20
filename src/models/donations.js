const { v4: uuidv4 } = require('uuid');

/**
 * Donations have the following shape:
 * id - A unique identifier, UUID v4
 * donorName - The full name of the person making the donation
 * amount - The amount being donated, in cents
 * profileId - The profile the donation is made to
 * currency - The currency the donation is made in
 */
let donations = [
  {
    id: 'f7939023-3016-4a29-bffd-913f41b98598',
    donorName: 'Jane Smith',
    amount: 5000,
    profileId: '2ad19172-9683-407d-9732-8397d58ddcb2', // Nick's Fundraising Profile
    currency: 'AUD'
  },
  {
    id: '3e02ade4-c8f7-4c70-8f14-acfdd650dbf3',
    donorName: 'Sally Smith',
    amount: 9500,
    profileId: 'cf7e4790-2feb-4551-8dd9-f817117238a9', // Helper for Nick's Fundraising Profile
    currency: 'EUR'
  },
  {
    id: '19d7f3fa-eaf2-4171-aa35-34b73ac87148',
    donorName: 'John Doe',
    amount: 2700,
    profileId: '384f7229-a8b0-4d63-bab3-101d66047e24', // Campaign - More tests
    currency: 'EUR'
  }
];

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

module.exports = { getDonations, getDonationsByProfileIds, createDonation };