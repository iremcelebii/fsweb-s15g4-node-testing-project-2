exports.seed = async function (knex) {
  await knex("follow").truncate();
  await knex("users").truncate();
  await knex("roles").truncate();

  await knex("roles").insert([{ role_name: "admin" }, { role_name: "user" }]);
  await knex("users").insert([
    {
      username: "bob",
      password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
      role_id: 1,
    },
    {
      username: "irem",
      password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
      role_id: 2,
    },
    {
      username: "sena",
      password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
      role_id: 2,
    },
    {
      username: "oğuzhan",
      password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
      role_id: 2,
    },
    {
      username: "batu",
      password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
      role_id: 2,
    },
    {
      username: "mert",
      password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
      role_id: 2,
    },
    {
      username: "meltem",
      password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
      role_id: 2,
    },
  ]);
  await knex("follow").insert([
    {
      from_user_id: 2,
      to_user_id: 3,
    },
    {
      from_user_id: 2,
      to_user_id: 4,
    },
    {
      from_user_id: 2,
      to_user_id: 5,
    },
    {
      from_user_id: 2,
      to_user_id: 6,
    },
    {
      from_user_id: 2,
      to_user_id: 7,
    },
    {
      from_user_id: 3,
      to_user_id: 2,
    },
    {
      from_user_id: 3,
      to_user_id: 4,
    },

    {
      from_user_id: 4,
      to_user_id: 2,
    },
    {
      from_user_id: 4,
      to_user_id: 3,
    },
    {
      from_user_id: 5,
      to_user_id: 2,
    },

    {
      from_user_id: 5,
      to_user_id: 6,
    },
    {
      from_user_id: 5,
      to_user_id: 7,
    },

    {
      from_user_id: 6,
      to_user_id: 2,
    },

    {
      from_user_id: 6,
      to_user_id: 5,
    },
    {
      from_user_id: 6,
      to_user_id: 7,
    },

    {
      from_user_id: 7,
      to_user_id: 2,
    },

    {
      from_user_id: 7,
      to_user_id: 5,
    },
    {
      from_user_id: 7,
      to_user_id: 6,
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
      tweet_id: 6,
      from_user_id: 6,
    },
    {
      comment_content: "Meltem'in ikinci tweetine İrem'den ilk yorum",
      tweet_id: 7,
      from_user_id: 2,
    },

    {
      comment_content: "Meltem'in ikinci tweetine Batu'dan ikinci yorum",
      tweet_id: 7,
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
