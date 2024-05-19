/**
 * Fundraising profiles have the following shape:
 * id - A unique identifier, UUID v4
 * name - The display name for the profile
 * total - The total amount raised, in cents
 * parentId - The id of the profile that this profile belongs to. An ID of null indicates that the profile belongs is the root campaign profile
 * currency - The currency the profile is tracking their total in
 */
let profiles = [
  {
    id: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
    name: 'Campaign Profile',
    parentId: null,
    currency: 'AUD'
  },
  {
    id: '2ad19172-9683-407d-9732-8397d58ddcb2',
    name: "Nick's Fundraising Profile",
    parentId: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
    currency: 'AUD'
  }
];

const getProfiles = () => {
  return profiles;
};

const createProfile = (profile) => {
  profiles.push(profile);
};

module.exports = { getProfiles, createProfile };