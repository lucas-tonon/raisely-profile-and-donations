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
    name: 'Nick\'s Fundraising Profile',
    parentId: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
    currency: 'AUD'
  },
  {
    id: '064dc448-3061-485a-b2ad-125da2e82612',
    name: 'Nick\'s Friend',
    parentId: '2ad19172-9683-407d-9732-8397d58ddcb2',
    currency: 'USD'
  },
  {
    id: 'cf7e4790-2feb-4551-8dd9-f817117238a9',
    name: 'Helper for Nick\'s Fundraising Profile',
    parentId: '2ad19172-9683-407d-9732-8397d58ddcb2',
    currency: 'EUR'
  },
  {
    id: '384f7229-a8b0-4d63-bab3-101d66047e24',
    name: 'Campaign - More tests',
    parentId: null,
    currency: 'USD'
  },
];

// SELECT * from profiles;
const getProfiles = () => {
  return profiles;
};

// SELECT * from profiles WHERE id = <profileId>;
const getProfileById = (profileId) => {
  return profiles.filter(p => p.id === profileId)[0];
};

module.exports = { getProfiles, getProfileById };