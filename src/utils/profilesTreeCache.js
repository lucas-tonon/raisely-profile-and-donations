const profilesAdjacencyListCache = {};

const buildProfilesAdjacencyListCache = (profiles) => {
    for (let profile of profiles) {
        profilesAdjacencyListCache[profile.id] = [];
    }

    for (let profile of profiles) {
        if (!profile.parentId) continue;

        profilesAdjacencyListCache[profile.parentId].push(profile.id);
    }
};

const getProfileIdsFromSubtree = (rootProfileId) => {
    const profileIds = [];

    let queue = [rootProfileId];

    // BFS logic to get all profile ids in subtree
    while (queue.length) {
        let current = queue.shift();
        profileIds.push(current);

        for (let child of profilesAdjacencyListCache[current]) {
            queue.push(child);
        }
    }

    return profileIds;
};

module.exports = {
    profilesAdjacencyListCache,
    buildProfilesAdjacencyListCache,
    getProfileIdsFromSubtree
};