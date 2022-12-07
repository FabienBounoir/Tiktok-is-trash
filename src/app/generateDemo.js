const demoDataUser = async () => {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                username: "Tiktok",
                phone: "+33700000000",
                avatar: "https://thispersondoesnotexist.com/",
                following: Math.floor(Math.random() * 10000),
                follower: Math.floor(Math.random() * 10000),
                like: Math.floor(Math.random() * 100000),
                bio: "This is a demo account",
                birthdate: "30/10/2000",
                email: "support@tiktok.com",
            });
        } catch (error) {
            console.log(error)
            reject("❌ Data User error");
        }
    });
}

const demoBestStats = async (dataUser) => {
    return new Promise((resolve, reject) => {
        try {
            let bestStats = {
                firstFollowers: [
                    {
                        UserName: "tiktok",
                        Date: Date.now(),
                    },
                    {
                        UserName: "badbounstv",
                        Date: Date.now(),
                    },
                    {
                        UserName: "discord",
                        Date: Date.now(),
                    },
                    {
                        UserName: "discord_fr",
                        Date: Date.now(),
                    },
                    {
                        UserName: "github",
                        Date: Date.now(),
                    }
                ],
                firstFollowing: [
                    {
                        UserName: "tiktok",
                        Date: Date.now(),
                    },
                    {
                        UserName: "badbounstv",
                        Date: Date.now(),
                    },
                    {
                        UserName: "discord",
                        Date: Date.now(),
                    },
                    {
                        UserName: "discord_fr",
                        Date: Date.now(),
                    },
                    {
                        UserName: "github",
                        Date: Date.now(),
                    }
                ],
                totalHastags: Math.floor(Math.random() * 100),
                purchase: 0,
                bestHastags: [{
                    name: "Tiktok",
                    value: Math.floor(Math.random() * 100),
                },
                {
                    name: "Bouns",
                    value: Math.floor(Math.random() * 100),
                },
                {
                    name: "Svelte",
                    value: Math.floor(Math.random() * 100),
                },
                {
                    name: "Github",
                    value: Math.floor(Math.random() * 100),
                },
                {
                    name: "BadbounsTV",
                    value: Math.floor(Math.random() * 100),
                }
                ],
                totalVideoLike: Math.floor(Math.random() * 10000),
                totalViewTiktok: Math.floor(Math.random() * 100000),
                totalCommentTiktok: Math.floor(Math.random() * 500),
                firstVideo: {
                    Date: Date.now(),
                },
                firstComment: { Comment: "Do you know tiktok is trash ? ", Date: "1670418653382" },
                totalSearch: Math.floor(Math.random() * 123),
                bestWordUseInSearch: [
                    { word: "Tiktok", count: Math.floor(Math.random() * 20) },
                    { word: "Trash", count: Math.floor(Math.random() * 20) },
                    { word: "BadbounsTV", count: Math.floor(Math.random() * 20) },
                    { word: "Github", count: Math.floor(Math.random() * 20) },
                    { word: "Svelte", count: Math.floor(Math.random() * 20) },
                ],
            }

            resolve(bestStats);
        } catch (error) {
            console.log(error);
            reject("❌ Best Stats error");
        }
    })
}

const demoLiveStats = async () => {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                totalLive: Math.floor(Math.random() * 1000),
                totalLikeLive: Math.floor(Math.random() * 100000),
                totalViewLive: Math.floor(Math.random() * 1000000),
                bestLiveLike: {
                    "ReplayUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "RoomId": "Y398YG",
                    "CoverUri": "",
                    "RoomTitle": "Live 1",
                    "LiveDuration": Math.floor(Math.random() * 100),
                    "TotalLike": Math.floor(Math.random() * 100000),
                },
                bestLiveView: {
                    "ReplayUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "RoomId": "INF23F",
                    "CoverUri": "",
                    "RoomTitle": "Live 2",
                    "LiveDuration": Math.floor(Math.random() * 100),
                    "TotalView": Math.floor(Math.random() * 100000),
                },
            });
        } catch (error) {
            console.log(error);
            reject("❌ Live data error");
        }
    })
}

const randomHourTiktok = () => {
    let bestHoursTiktok = new Array(24).fill(0);


    return new Promise((resolve, reject) => {
        try {
            for (let i = 0; i < 24; i++) {
                bestHoursTiktok[i] = Math.floor(Math.random() * 10000);
            }

            resolve(bestHoursTiktok);
        } catch (error) {
            console.log(error);
            reject("❌ Random hour tiktok error");
        }
    })
}


export { demoDataUser, demoBestStats, demoLiveStats, randomHourTiktok }