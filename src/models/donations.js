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
    profileId: '2ad19172-9683-407d-9732-8397d58ddcb2',
    currency: 'AUD'
  }
];

const getDonations = () => {
  return donations;
};

const getDonationsByProfileIds = (profileIds) => {
  // Creating a map to allow O(n) filtering by keys
  const queryProfileIdsMap = profileIds.reduce((a, v) => ({ ...a, [v]: true }), {});

  const donations = getDonations();
  const filteredDonations = [];

  for (let donation of donations) {
    const donationProfileId = donation.profileId;

    if (queryProfileIdsMap[donationProfileId]) {
      filteredDonations.push(donation);
    }
  }

  return filteredDonations;
};

const createDonation = (donation) => {
  donations.push(donation);
};

module.exports = { getDonations, getDonationsByProfileIds, createDonation };