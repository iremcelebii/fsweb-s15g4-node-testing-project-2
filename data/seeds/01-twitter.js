const roles = [{ role_name: "admin" }, { role_name: "user" }];
const sorular = [
  { soru_name: "İlkokul öğretmeninin adı" },
  { soru_name: "İlk evcil hayvanının adı" },
  { soru_name: "En sevdiğin renk" },
];
const users = [
  {
    username: "bob",
    password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
    role_id: 1,
    soru_id: 3,
    soru_cevap: "Pembe",
  },
  {
    username: "irem",
    password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
    role_id: 2,
    soru_id: 1,
    soru_cevap: "Melike",
  },
  {
    username: "sena",
    password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
    role_id: 2,
    soru_id: 2,
    soru_cevap: "Leo",
  },
  {
    username: "oğuzhan",
    password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
    role_id: 2,
    soru_id: 2,
    soru_cevap: "Leo",
  },
  {
    username: "batu",
    password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
    role_id: 2,
    soru_id: 1,
    soru_cevap: "Emre",
  },
  {
    username: "mert",
    password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
    role_id: 2,
    soru_id: 3,
    soru_cevap: "Turuncu",
  },
  {
    username: "meltem",
    password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
    role_id: 2,
    soru_id: 3,
    soru_cevap: "Yeşil",
  },
];
const follow = [
  {
    combine_user_id: "2_1",
    from_user_id: 2,
    to_user_id: 1,
  },

  {
    combine_user_id: "2_4",
    from_user_id: 2,
    to_user_id: 4,
  },
  {
    combine_user_id: "2_5",
    from_user_id: 2,
    to_user_id: 5,
  },
  {
    combine_user_id: "2_6",
    from_user_id: 2,
    to_user_id: 6,
  },
  {
    combine_user_id: "2_7",
    from_user_id: 2,
    to_user_id: 7,
  },
  {
    combine_user_id: "3_2",
    from_user_id: 3,
    to_user_id: 2,
  },
  {
    combine_user_id: "3_4",
    from_user_id: 3,
    to_user_id: 4,
  },

  {
    combine_user_id: "4_2",
    from_user_id: 4,
    to_user_id: 2,
  },
  {
    combine_user_id: "4_3",
    from_user_id: 4,
    to_user_id: 3,
  },
  {
    combine_user_id: "5_2",
    from_user_id: 5,
    to_user_id: 2,
  },

  {
    combine_user_id: "5_6",
    from_user_id: 5,
    to_user_id: 6,
  },
  {
    combine_user_id: "5_7",
    from_user_id: 5,
    to_user_id: 7,
  },

  {
    combine_user_id: "6_2",
    from_user_id: 6,
    to_user_id: 2,
  },

  {
    combine_user_id: "6_5",
    from_user_id: 6,
    to_user_id: 5,
  },
  {
    combine_user_id: "6_7",
    from_user_id: 6,
    to_user_id: 7,
  },

  {
    combine_user_id: "7_2",
    from_user_id: 7,
    to_user_id: 2,
  },

  {
    combine_user_id: "7_5",
    from_user_id: 7,
    to_user_id: 5,
  },
];
const tweets = [
  {
    tweet_content: "İrem'in ilk tweeti",
    user_id: 2,
  },
  {
    tweet_content: "İrem'in ikinci tweeti",
    user_id: 2,
  },
  {
    tweet_content: "Sena'nın ilk tweeti",
    user_id: 3,
  },
  {
    tweet_content: "Oğuzhan'ın ilk tweeti",
    user_id: 4,
  },
  {
    tweet_content: "Batu'nun ilk tweeti",
    user_id: 5,
  },
  {
    tweet_content: "Mert'in ilk tweeti",
    user_id: 6,
  },
  {
    tweet_content: "Meltem'in ilk tweeti",
    user_id: 7,
  },
  {
    tweet_content: "Meltem'in ikinci tweeti",
    user_id: 7,
  },
];
const comments = [
  {
    comment_content: "İrem'in ilk tweetine Sena'dan ilk yorum",
    tweet_id: 1,
    from_user_id: 3,
  },
  {
    comment_content: "İrem'in ilk tweetine Oğuzhan'dan ikinci yorum",
    tweet_id: 1,
    from_user_id: 4,
  },
  {
    comment_content: "Meltem'in ilk tweetine Mert'ten ilk yorum",
    tweet_id: 7,
    from_user_id: 6,
  },
  {
    comment_content: "Meltem'in ikinci tweetine İrem'den ilk yorum",
    tweet_id: 8,
    from_user_id: 2,
  },

  {
    comment_content: "Meltem'in ikinci tweetine Batu'dan ikinci yorum",
    tweet_id: 8,
    from_user_id: 5,
  },
];
const favs = [
  { combine_fav_id: "1_3", tweet_id: 1, from_user_id: 3 },
  { combine_fav_id: "1_4", tweet_id: 1, from_user_id: 4 },
  { combine_fav_id: "6_6", tweet_id: 6, from_user_id: 6 },
  { combine_fav_id: "7_2", tweet_id: 7, from_user_id: 2 },
  { combine_fav_id: "7_5", tweet_id: 7, from_user_id: 5 },
];

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("favs").truncate();
  await knex("comments").truncate();
  await knex("tweets").truncate();
  await knex("follow").truncate();
  await knex("users").truncate();
  await knex("sorular").truncate();
  await knex("roles").truncate();

  await knex("roles").insert(roles);
  await knex("sorular").insert(sorular);
  await knex("users").insert(users);
  await knex("follow").insert(follow);
  await knex("tweets").insert(tweets);
  await knex("comments").insert(comments);
  await knex("favs").insert(favs);
};
