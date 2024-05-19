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

const createDonation = (donation) => {
  donations.push(donation);
};

module.exports = { getDonations, createDonation };