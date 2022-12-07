<script>
  // @ts-nocheck
  import Chart from "svelte-frappe-charts";
  import DropFile from "./lib/DropFile.svelte";
  import json from "./assets/data.json";
  import { onMount } from "svelte";

  import likeIcon from "./assets/like.svg";
  import viewIcon from "./assets/view.svg";
  import liveIcon from "./assets/live.svg";
  import commentIcon from "./assets/comment.svg";
  import moneyIcon from "./assets/money.svg";
  import searchIcon from "./assets/search.svg";
  import hastagsIcon from "./assets/hastags.svg";

  let fileOver = false;
  let dataUser = null;
  let user = null;
  let bestStats = null;
  let bestHoursTiktok = new Array(24).fill(0);
  let live = null;
  let moyen = 0;

  let loading = false;
  let error = null;

  const hoursLabels = new Array(24)
    .fill(0)
    .map((v, i) =>
      i == 0 ? "12am" : i < 12 ? `${i}am` : i == 12 ? "12pm" : `${i - 12}pm`
    );

  const extractData = (data) => {
    try {
      user = {
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
      };

      bestStats = {
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
      };

      console.log(dataUser["Tiktok Live"])

      live = {
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
      };

      for (let search of dataUser?.Activity?.["Search History"]?.SearchList) {
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

      bestStats.bestWordUseInSearch = bestStats.bestWordUseInSearch
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      for (let purchase of dataUser?.Activity["Purchase History"]?.BuyGifts
        ?.BuyGifts ?? []) {
        bestStats.purchase += parseFloat(
          purchase.Price.replace(/[^0-9.-]+/g, "")
        );
      }

      for (let hastags of dataUser?.Activity.Hashtag.HashtagList) {
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

      for (let tiktok of dataUser?.Activity["Video Browsing History"].VideoList) {
        let date = new Date(tiktok.Date);

        bestHoursTiktok[
          date.getHours() + 2 < 24
            ? date.getHours() + 2
            : date.getHours() + 2 - 24
        ]++;
      }

      //Create moyen of tiktok by hour of day
      moyen = bestHoursTiktok.reduce((acc, v) => acc + v, 0) / 24;

      data = {
        labels: [
          "12am",
          "1am",
          "2am",
          "3am",
          "4am",
          "5am",
          "6am",
          "7am",
          "8am",
          "9am",
          "10am",
          "11am",
          "12pm",
          "1pm",
          "2pm",
          "3pm",
          "4pm",
          "5pm",
          "6pm",
          "7pm",
          "8pm",
          "9pm",
          "10pm",
          "11pm",
        ],
        datasets: [
          {
            label: "Vue Tiktok",
            data: bestHoursTiktok,
            borderWidth: 1,
          },
        ],
      };

      console.log(user);
      console.log(bestStats);
      console.log(dataUser);
      console.log(bestHoursTiktok);
      console.log(live);

      loading = false;
    } catch (e) {
      console.log(e);
      loading = false;
      dataUser = null;
      error = true;
    }
  };

  const extractFile = (file) => {
    loading = true;
    let reader = new FileReader();
    reader.onload = (e) => {
      let json = {};
      //check if file is a zip
      if (e.target.result.startsWith("PK")) {
        json = e.target.result.slice(
          e.target.result.indexOf("{"),
          e.target.result.length
        );

        json = json.slice(0, json.lastIndexOf("/user_data.json"));
        json = json.slice(0, json.lastIndexOf("}") + 1);

        console.log("json", json);
      } else {
        json = JSON.stringify(e.target.result);
      }

      console.log(json);

      //parse json
      let data = JSON.parse(json);
      dataUser = data;
      extractData(dataUser);
    };

    reader.readAsText(file[0]);
  };

  const onDrop = (files) => {
    extractFile(files);
    fileOver = false;
  };

  const numberArrondi = (number) => {
    if (number > 1000000) {
      return `${Math.round(number / 100000) / 10}M`;
    } else if (number > 1000) {
      return `${Math.round(number / 100) / 10}K`;
    } else {
      return number;
    }
  };

  // dataUser = json;
  // extractData(json);
</script>

<main>
  <div class="nav-bar">
    <h1
      on:click={() => {
        dataUser = null;
      }}
    >
      Tiktok is Trash 🗑
    </h1>
  </div>

  {#if dataUser == null}
    <div class="drop">
      <DropFile
        {onDrop}
        onEnter={() => (fileOver = true)}
        onLeave={() => (fileOver = false)}
      >
        <div class={`drop-zone ${fileOver ? "over" : ""}`}>
          {#if fileOver}
            <p>Drop it!</p>
          {:else if error}
            <p><strong>Something went wrong</strong></p>
          {:else if loading}
            <p>Loading...</p>
          {:else}
            <p>Click here to select your Tiktok data</p>
          {/if}
        </div>
      </DropFile>
    </div>
    <footer>
      <p>
        Made with ❤️ by <a
          href="https://github.com/FabienBounoir"
          target="_blank">Fabien Bounoir</a
        >
        is an open source project, you can find the code
        <a
          href="https://github.com/FabienBounoir/tiktok-is-trash"
          target="_blank">here</a
        >
      </p>
    </footer>
  {:else}
    <div class="data">
      <div class="profile">
        <img
          src={user.avatar}
          alt=""
          on:error={(e) =>
            (e.target.src =
              "https://cdn.stockmediaserver.com/smsimg33/PV/IsignstockContributors/iss_24922_01172.jpg?token=wDIlX_XpH_aVteNnU7SCzd_yCtYb6m0hMCuUvxuRuCs&class=pv&smss=52&expires=4102358400")}
        />
        <h1>{user.username}</h1>
        <div class="follow">
          <div class="container">
            <p>{numberArrondi(user.following)}</p>
            <p>Following</p>
          </div>

          <div class="container">
            <p>{numberArrondi(user.follower)}</p>
            <p>Follower</p>
          </div>

          <div class="container">
            <p>{numberArrondi(user.like)}</p>
            <p>Like</p>
          </div>
        </div>
      </div>

      <div class="globalStats">
        {#if bestStats}
          <h1>Your Global Stats</h1>
          <div class="list">
            <div class="item">
              <img src={commentIcon} alt="" />
              <h3>
                You have sent <strong
                  >{numberArrondi(bestStats?.totalCommentTiktok)}</strong
                >
                comments
              </h3>
            </div>
            <div class="item">
              <img src={commentIcon} alt="" />
              <h3>
                Your first comment is <i
                  ><strong>"{bestStats?.firstComment?.Comment?.trim()}"</strong
                  ></i
                >
                you sent it on {new Date(
                  bestStats?.firstComment?.Date
                )?.toLocaleDateString()}
              </h3>
            </div>

            <div class="item">
              <img src={viewIcon} alt="" />
              <h3>
                You have watch <strong
                  >{numberArrondi(bestStats?.totalViewTiktok)}</strong
                > Tiktok
              </h3>
            </div>
            <div class="item">
              <img src={viewIcon} alt="" />
              <h3>
                You watched your first Tiktok on
                <strong
                  >{new Date(
                    bestStats?.firstVideo?.Date
                  ).toLocaleDateString()}</strong
                >
              </h3>
            </div>
          </div>
        {:else}
          <h3 class="center">You have no stats to display</h3>
        {/if}
      </div>

      <div class="tiktokStats">
        {#if bestStats}
          <h1>Your Tiktok Stats</h1>
          <div class="list">
            <div class="item">
              <img src={hastagsIcon} alt="" />
              <h3>
                You have used <strong>{bestStats.totalHastags}</strong> Hashtags
              </h3>
            </div>
            <div class="item">
              <img src={hastagsIcon} alt="" />
              <h3>
                Your <strong>{bestStats.bestHastags.length}</strong> Hastags
                favorites: {@html bestStats.bestHastags.map((hashtag) => {
                  return ` <strong>#${hashtag.name}</strong>`;
                })}
              </h3>
            </div>

            <div class="item">
              <img src={viewIcon} alt="" />
              <h3>
                You have watch <strong
                  >{numberArrondi(bestStats.totalViewTiktok)}</strong
                > Tiktok
              </h3>
            </div>
            <div class="item">
              <img src={moneyIcon} alt="" />
              <h3>
                You spent <strong>{bestStats.purchase}$</strong> on TikTok
              </h3>
            </div>

            <div class="item">
              <img src={searchIcon} alt="" />
              <h3>
                You have make <strong>{bestStats.totalSearch}</strong> search on
                Tiktok
              </h3>
            </div>

            <div class="item">
              <img src={searchIcon} alt="" />
              <h3>
                Your <strong>{bestStats.bestWordUseInSearch.length}</strong>
                most searched words are {@html bestStats.bestWordUseInSearch.map(
                  (word) => {
                    return ` <strong>${
                      word.word[0].toUpperCase() + word.word.slice(1)
                    } (${word.count})</strong>`;
                  }
                )}
              </h3>
            </div>
          </div>
        {:else}
          <h3 class="center">Your history is empty</h3>
        {/if}
      </div>

      <div class="live">
        {#if live && live?.totalLive > 0}
          <h1>Your Live Stats</h1>
          <div class="list">
            <div class="item">
              <img src={liveIcon} alt="" />
              <h3>
                You have accumulated <strong
                  >{numberArrondi(live.totalViewLive)}</strong
                >
                views and
                <strong>{numberArrondi(live.totalLikeLive)}</strong> likes on your
                live videos
              </h3>
            </div>
            {#if live?.bestLiveLike?.RoomId != live?.bestLiveView?.RoomId}
              <div class="item">
                <img src={viewIcon} alt="" />
                <h3>Your live with the <strong>most views</strong>:</h3>
              </div>
              <a
                class="list-element"
                href={live?.bestLiveView?.ReplayUrl}
                target="_blank"
              >
                <img src={live?.bestLiveView?.CoverUri} alt="" />
                <p>
                  <strong>{live?.bestLiveView?.RoomTitle}</strong>
                </p>
                <p>{live?.bestLiveView?.LiveDuration} Min</p>
                <p>{live?.bestLiveView?.TotalView} View</p>
              </a>

              <div class="item">
                <img src={likeIcon} alt="" />
                <h3>Your live with the <strong>most likes</strong>:</h3>
              </div>
              <a
                class="list-element"
                href={live?.bestLiveLike?.ReplayUrl}
                target="_blank"
              >
                <img src={live?.bestLiveLike?.CoverUri} alt="" />
                <p>
                  <strong>{live?.bestLiveLike?.RoomTitle}</strong>
                </p>
                <p>{live?.bestLiveLike?.LiveDuration} Min</p>
                <p>{live?.bestLiveLike?.TotalLike} Like</p>
              </a>
            {:else}
              <div class="item">
                <img src={viewIcon} alt="" />
                <h3>Your best live:</h3>
              </div>
            {/if}
          </div>
        {:else}
          <h3 class="center">You have never been live</h3>
        {/if}
      </div>

      <div class="hours">
        <h1>Your TikTok Hours</h1>
        <p>
          <strong
            >{hoursLabels[
              bestHoursTiktok.indexOf(Math.max(...bestHoursTiktok))
            ]}</strong
          > is your favorite hour to watch Tiktok !
        </p>
        <Chart
          data={{
            labels: hoursLabels,
            datasets: [
              {
                name: "Tiktok",
                values: bestHoursTiktok,
              },
            ],
            yMarkers: [
              {
                label: "average",
                value: moyen,
                options: { labelPos: "left" }, // default: 'right'
              },
            ],
          }}
          colors={["#ff0050", "#00f2ea"]}
          axisOptions={{
            xAxisMode: "tick",
          }}
          barOptions={{
            spaceRatio: 0.5, // default: 1
          }}
          type="bar"
        />
      </div>

      <!-- <div class="days">
        <h1>Your TikTok Days</h1>
        <p>
          <strong
            >{daysLabels[
              bestDaysTiktok.indexOf(Math.max(...bestDaysTiktok))
            ]}</strong
          > is your favorite day to watch Tiktok !
        </p>
        <Chart
          type="heatmap"
          data={{
            labels: hoursLabels,
            datasets: [
              {
                name: "Tiktok",
                values: bestHoursTiktok,
              },
            ],
          }}
        />
        />
      </div> -->

      <div class="firstFollowed">
        <h1>Your first followed user is:</h1>
        {#each bestStats.firstFollowers as followed, i}
          <a
            class="list-element"
            href={`https://www.tiktok.com/@${followed.UserName}`}
            target="_blank"
          >
            <div>
              <p class="list-balise">
                {i + 1}
              </p>
              <p class="username">
                <strong
                  >{followed.UserName[0].toUpperCase() +
                    followed.UserName.slice(1)}</strong
                >
              </p>
            </div>
            <p>{new Date(followed?.Date).toLocaleString()}</p>
          </a>
        {/each}
      </div>

      <div class="firstFollowers">
        <h1>Your first follower is:</h1>
        {#each bestStats.firstFollowing as follower, i}
          <a
            class="list-element"
            href={`https://www.tiktok.com/@${follower.UserName}`}
            target="_blank"
          >
            <div>
              <p class="list-balise">
                {i + 1}
              </p>
              <p class="username">
                <strong
                  >{follower.UserName[0].toUpperCase() +
                    follower.UserName.slice(1)}</strong
                >
              </p>
            </div>
            <p>{new Date(follower?.Date).toLocaleString()}</p>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</main>

<style lang="scss">
  strong {
    color: #00f2ea;
  }

  h3 {
    font-size: 19px;
  }

  .center {
    text-align: center;
  }

  .data {
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    height: calc(100vh - 60px);
    gap: 10px;
    padding: 21px;

    > * {
      box-sizing: border-box;
      border-radius: 1em;
      border: 1px solid #ccc;
      padding: 1em;
    }

    > div {
      display: flex;
      flex-direction: column;
      // align-items: center;
      justify-content: space-evenly;
    }

    .profile {
      grid-column: 1 / 4;

      height: 100%;
      text-align: center;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;

      img {
        width: 128px;
        height: 128px;
        border-radius: 50%;
      }

      .follow {
        display: flex;
        justify-content: space-evenly;
        width: 100%;

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;

          p:first-child {
            font-weight: bold;
          }

          p {
            margin: 0;
          }
        }
      }
    }

    .globalStats {
      grid-column: 4 / 8;
      height: 100%;
    }

    .tiktokStats {
      grid-column: 1 / 6;
      grid-row: 2 / 3;
      height: 100%;
    }

    .hours {
      grid-column: 6 / 12;
      grid-row: 2 / 3;
      height: 100%;
    }

    .days {
      grid-column: 1 / 7;
      grid-row: 5 / 6;
      height: 100%;
    }

    .firstFollowed {
      grid-column: 1 / 6;
      grid-row: 3 / 5;
      height: 100%;

      > .list-element {
        overflow-x: hidden;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #9400dd;

        .list-balise {
          background-color: #ff0050;
          align-items: center;
          justify-content: center;
          display: flex;
          flex: 0 0 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 10px;
          color: white;
          font-weight: bold;
        }

        > div {
          display: flex;
          align-items: center;
        }
      }
    }

    .firstFollowers {
      grid-column: 6 / 12;
      grid-row: 3 / 5;
      height: 100%;

      > .list-element {
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #9400dd;

        .list-balise {
          background-color: #ff0050;
          align-items: center;
          justify-content: center;
          display: flex;
          flex: 0 0 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 10px;
          color: white;
          font-weight: bold;
        }

        > div {
          display: flex;
          align-items: center;
        }
      }
    }

    .live {
      grid-column: 8 / 12;

      height: 100%;

      .list-element {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1em;
        margin-left: calc(48px + 1em);
        text-decoration: none;

        &:hover {
          background-color: #f2f2f2;
        }

        > * {
          margin: 0;
          padding: 0;
        }

        // justify-content: space-evenly;

        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }

    .list {
      height: 100%;

      .item {
        // margin: 0;
        display: flex;
        align-items: center;
        gap: 1em;
        // margin-bottom: 1em;

        img {
          width: 48px;
          height: 48px;
        }
      }
    }
  }

  .drop {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 60px);
  }

  .drop-zone {
    display: grid;
    align-items: center;
    margin: auto;
    width: calc(100vh - 50vh);
    height: calc(100vh - 80vh);
    color: white;
    border: 2px dashed #ff0050;
    // border-image: linear-gradient(90deg, #ff3e00, #ff3e00);

    // box-sizing: content-box;
    // border-width: 2px;
    // border-style: dashed;
    // border-image: linear-gradient(to right bottom, #00f2ea, #ff0050);
    // border-image-slice: 1;

    border-radius: 10px;
    cursor: pointer;
  }
  .over {
    background: linear-gradient(120deg, #00f2ea, #ff0050);
    // color: #ff3e00;
    border: black solid 2px;
  }
  .drop-zone p {
    text-align: center;
  }

  .nav-bar {
    justify-content: space-around;
    box-shadow: 0px 1px 1px rgb(255 255 255 / 12%);
    height: 60px;
    width: 100vw;
    top: 0;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: rgba(18, 18, 18, 1);
    display: flex;
    align-items: center;

    > h1 {
      cursor: pointer;
    }
  }

  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: rgba(18, 18, 18, 1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-shadow: 0px -1px 1px rgb(255 255 255 / 12%);

    a {
      color: #00f2ea;
      text-decoration: none;
    }
  }

  @media screen and (max-width: 1250px) {
    .data {
      .profile {
        grid-column: 1 / 5;
      }

      .globalStats {
        grid-column: 5 / 12;
      }

      .hours {
        grid-column: 1 / 7;
        grid-row: 2 / 3;
      }

      .tiktokStats {
        grid-column: 7 / 12;
        grid-row: 2 / 3;
      }

      .live {
        grid-column: 1 / 6;
        grid-row: 3 / 4;
      }

      .firstFollowers {
        grid-column: 6 / 12;
        grid-row: 3 / 4;
        height: 100%;
      }

      .firstFollowed {
        grid-column: 1 / 6;
        grid-row: 4 / 5;
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .data {
      .profile {
        grid-column: 1 / 12;
      }

      .globalStats {
        grid-column: 1 / 12;
        grid-row: 2 / 3;
      }

      .hours {
        grid-column: 1 / 12;
        grid-row: 3 / 4;
      }

      .tiktokStats {
        grid-column: 1 / 12;
        grid-row: 4 / 5;
      }

      .live {
        grid-column: 1 / 12;
        grid-row: 5 / 6;

        .list-element {
          margin-left: 0;
        }
      }

      .firstFollowers {
        grid-column: 1 / 12;
        grid-row: 6 / 7;

        .username {
          text-overflow: ellipsis;
          // white-space: nowrap;
          overflow: hidden;
        }
      }

      .firstFollowed {
        grid-column: 1 / 12;
        grid-row: 7 / 8;

        .username {
          text-overflow: ellipsis;
          // white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
</style>
