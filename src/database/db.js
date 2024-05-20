/**
 * Donations have the following shape:
 * id - A unique identifier, UUID v4
 * donorName - The full name of the person making the donation
 * amount - The amount being donated, in cents
 * profileId - The profile the donation is made to
 * currency - The currency the donation is made in
 */
const donations = [
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

/**
 * Fundraising profiles have the following shape:
 * id - A unique identifier, UUID v4
 * name - The display name for the profile
 * total - The total amount raised, in cents
 * parentId - The id of the profile that this profile belongs to. An ID of null indicates that the profile belongs is the root campaign profile
 * currency - The currency the profile is tracking their total in
 */
const profiles = [
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


module.exports = {
    donations,
    profiles
};