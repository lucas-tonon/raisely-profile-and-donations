const { v4: uuidv4 } = require('uuid');

const { donations } = require('../database/db');

/**
 * Retrieves all donations made to a specific profileId
 * @param {String} profileId
 * @returns Array of donations
 */
const getDonationsByProfileId = (profileId) => {
  return donations.filter(d => d.profileId === profileId);
};

/**
 * Creates a new donation entity
 * @param {Object} donation
 * @returns
 */
const createDonation = (donation) => {
  const newDonation = { ...donation, id: uuidv4() };
  donations.push(newDonation);

  return newDonation;
};

module.exports = {
  getDonationsByProfileId,
  createDonation
};