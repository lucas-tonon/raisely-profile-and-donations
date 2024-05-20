const { createDonationForCampaign } = require('../services/donations');

/**
 * Submit a new donation to the campaign
 */
const createCampaignDonation = (req, res) => {
  const donationData = req.body;
  const newDonation = createDonationForCampaign(donationData);

  res.status(201).json(newDonation);
};

module.exports = {
  createCampaignDonation
};