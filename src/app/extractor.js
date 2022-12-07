const extractDataUser = async (dataUser) => {
    return new Promise((resolve, reject) => {
        try {
            resolve({
                username: dataUser?.Profile["Profile Information"].ProfileMap.userName,
                phone:
                    dataUser?.Profile["Profile Information"].ProfileMap.telephoneNumber,
                avatar:
                    dataUser?.Profile["Profile Information"].ProfileMap.profilePhoto,
                following: dataUser?.Activity["Following List"].Following.length,
                follower: dataUser?.Activity["Follower List"].FansList.length,
                like: dataUser?.Profile["Profile Information"].ProfileMap.likesReceived,
                bio: dataUser?.Profile["Profile Information"].ProfileMap.bioDescription,
                birthdate:
                    dataUser?.Profile["Profile Information"].ProfileMap.birthDate,
                email: dataUser?.Profile["Profile Information"].ProfileMap.emailAddress,
            });
        } catch (error) {
            console.log(error)
            reject("❌ Data User error");
        }
    });
}

const extractBestStats = async (dataUser) => {
    return new Promise((resolve, reject) => {
        try {
            let bestStats = {
                firstFollowers: dataUser?.Activity["Follower List"].FansList.slice(
                    dataUser?.Activity["Follower List"].FansList.length - 5,
                    dataUser?.Activity["Follower List"].FansList.length
                ).reverse(),
                firstFollowing: dataUser?.Activity["Following List"].Following.slice(
                    dataUser?.Activity["Following List"].Following.length - 5,
                    dataUser?.Activity["Following List"].Following.length
                ).reverse(),
                firstHastags: dataUser?.Activity.Hashtag.HashtagList.slice(
                    dataUser?.Activity.Hashtag.HashtagList.length - 5,
                    dataUser?.Activity.Hashtag.HashtagList.length
                ).reverse(),
                totalHastags: dataUser?.Activity.Hashtag.HashtagList.length,
                purchase: 0,
                bestHastags: [],
                totalVideoLike: dataUser?.Activity["Like List"].ItemFavoriteList.length,
                firstLike: dataUser?.Activity["Like List"].ItemFavoriteList.slice(
                    dataUser?.Activity["Like List"].ItemFavoriteList.length - 5,
                    dataUser?.Activity["Like List"].ItemFavoriteList.length
                ).reverse(),
                totalViewTiktok:
                    dataUser?.Activity["Video Browsing History"].VideoList.length,

                totalCommentTiktok: dataUser?.Comment.Comments.CommentsList.length,
                firstVideo:
                    dataUser?.Activity["Video Browsing History"].VideoList[
                    dataUser?.Activity["Video Browsing History"].VideoList.length - 1
                    ],
                firstComment:
                    dataUser?.Comment.Comments.CommentsList[
                    dataUser?.Comment.Comments.CommentsList.length - 1
                    ],
                totalSearch: dataUser?.Activity?.["Search History"]?.SearchList?.length,
                bestWordUseInSearch: [],
            }

            for (let search of dataUser?.Activity?.["Search History"]?.SearchList ?? []) {
                for (let word of search.SearchTerm.split(" ")) {
                    if (word.length < 4) continue;
                    if (
                        bestStats.bestWordUseInSearch.find(
                            (v) => v.word.toLowerCase() == word.toLowerCase()
                        )
                    ) {
                        bestStats.bestWordUseInSearch.find(
                            (v) => v.word.toLowerCase() == word.toLowerCase()
                        ).count++;
                    } else {
                        bestStats.bestWordUseInSearch.push({
                            word: word.toLowerCase(),
                            count: 1,
                        });
                    }
                }
            }

            for (let purchase of dataUser?.Activity["Purchase History"]?.BuyGifts
                ?.BuyGifts ?? []) {
                bestStats.purchase += parseFloat(
                    purchase.Price.replace(/[^0-9.-]+/g, "")
                );
            }

            for (let hastags of dataUser?.Activity?.Hashtag?.HashtagList ?? []) {
                if (bestStats.bestHastags[hastags.HashtagName.toLowerCase()]) {
                    bestStats.bestHastags[hastags.HashtagName.toLowerCase()] += 1;
                } else {
                    bestStats.bestHastags[hastags.HashtagName.toLowerCase()] = 1;
                }
            }

            bestStats.bestHastags = Object.entries(bestStats.bestHastags)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map((v) => ({ name: v[0], value: v[1] }));

            bestStats.bestWordUseInSearch = bestStats.bestWordUseInSearch
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            resolve(bestStats);
        } catch (error) {
            console.log(error);
            reject("❌ Best Stats error");
        }
    })
}

const extractLiveStats = async (dataUser) => {
    return new Promise((resolve, reject) => {
        try {

            console.log(dataUser["Tiktok Live"][
                "Go Live History"
            ]?.GoLiveList?.reduce(
                (acc, v) =>
                    parseInt(acc.TotalLike) > parseInt(v.TotalLike) ? acc : v,
                0
            ))

            console.log(dataUser["Tiktok Live"][
                "Go Live History"
            ]?.GoLiveList?.reduce(
                (acc, v) =>
                    parseInt(acc.TotalView) > parseInt(v.TotalView) ? acc : v,
                0
            ))

            resolve({
                totalLive:
                    dataUser["Tiktok Live"]["Go Live History"]?.GoLiveList?.length,
                totalLikeLive: dataUser["Tiktok Live"][
                    "Go Live History"
                ]?.GoLiveList?.reduce(
                    (acc, v) => parseInt(acc) + parseInt(v.TotalLike),
                    0
                ),
                totalViewLive: dataUser["Tiktok Live"][
                    "Go Live History"
                ]?.GoLiveList?.reduce(
                    (acc, v) => parseInt(acc) + parseInt(v.TotalView),
                    0
                ),
                bestLiveLike: dataUser["Tiktok Live"][
                    "Go Live History"
                ]?.GoLiveList?.reduce(
                    (acc, v) =>
                        parseInt(acc.TotalLike) > parseInt(v.TotalLike) ? acc : v,
                    0
                ),
                bestLiveView: dataUser["Tiktok Live"][
                    "Go Live History"
                ]?.GoLiveList?.reduce(
                    (acc, v) =>
                        parseInt(acc.TotalView) > parseInt(v.TotalView) ? acc : v,
                    0
                ),
            });
        } catch (error) {
            console.log(error);
            reject("❌ Live data error");
        }
    })
}

const calculeHourTiktok = (tiktokList) => {
    let bestHoursTiktok = new Array(24).fill(0);
    return new Promise((resolve, reject) => {
        try {
            for (let tiktok of tiktokList) {
                let date = new Date(tiktok.Date);

                bestHoursTiktok[
                    date.getHours() + 2 < 24
                        ? date.getHours() + 2
                        : date.getHours() + 2 - 24
                ]++;
            }

            resolve(bestHoursTiktok);
        } catch (error) {
            console.log(error);
            reject("❌ calcule hour error");
        }
    })
}


export { extractDataUser, extractBestStats, extractLiveStats, calculeHourTiktok }