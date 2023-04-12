exports.seed = async function (knex) {
  await knex("follow").truncate();
  await knex("users").truncate();
  await knex("roles").truncate();

  await knex("roles").insert([{ role_name: "admin" }, { role_name: "user" }]);

  await knex("sorular").insert([
    { soru_name: "İlkokul öğretmeninin adı" },
    { soru_name: "İlk evcil hayvanının adı" },
    { soru_name: "En sevdiğin renk" },
  ]);

  await knex("users").insert([
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
  ]);
  await knex("follow").insert([
    {
      combine_user_id: 21,
      from_user_id: 2,
      to_user_id: 1,
    },

    {
      combine_user_id: 24,
      from_user_id: 2,
      to_user_id: 4,
    },
    {
      combine_user_id: 25,
      from_user_id: 2,
      to_user_id: 5,
    },
    {
      combine_user_id: 26,
      from_user_id: 2,
      to_user_id: 6,
    },
    {
      combine_user_id: 27,
      from_user_id: 2,
      to_user_id: 7,
    },
    {
      combine_user_id: 32,
      from_user_id: 3,
      to_user_id: 2,
    },
    {
      combine_user_id: 34,
      from_user_id: 3,
      to_user_id: 4,
    },

    {
      combine_user_id: 42,
      from_user_id: 4,
      to_user_id: 2,
    },
    {
      combine_user_id: 43,
      from_user_id: 4,
      to_user_id: 3,
    },
    {
      combine_user_id: 52,
      from_user_id: 5,
      to_user_id: 2,
    },

    {
      combine_user_id: 56,
      from_user_id: 5,
      to_user_id: 6,
    },
    {
      combine_user_id: 57,
      from_user_id: 5,
      to_user_id: 7,
    },

    {
      combine_user_id: 62,
      from_user_id: 6,
      to_user_id: 2,
    },

    {
      combine_user_id: 65,
      from_user_id: 6,
      to_user_id: 5,
    },
    {
      combine_user_id: 67,
      from_user_id: 6,
      to_user_id: 7,
    },

    {
      combine_user_id: 72,
      from_user_id: 7,
      to_user_id: 2,
    },

    {
      combine_user_id: 75,
      from_user_id: 7,
      to_user_id: 5,
    },
  ]);
  await knex("tweets").insert([
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
  ]);

  await knex("comments").insert([
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
  ]);

  await knex("favs").insert([
    {
      tweet_id: 1,
      from_user_id: 3,
    },
    {
      tweet_id: 1,
      from_user_id: 4,
    },
    {
      tweet_id: 6,
      from_user_id: 6,
    },
    {
      tweet_id: 7,
      from_user_id: 2,
    },

    {
      tweet_id: 7,
      from_user_id: 5,
    },
  ]);
};
