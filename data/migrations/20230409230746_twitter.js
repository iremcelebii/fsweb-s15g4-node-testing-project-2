exports.up = function (knex) {
  return knex.schema
    .createTable("roles", (roles) => {
      roles.increments("role_id");
      roles.string("role_name", 32).notNullable().unique();
    })
    .createTable("sorular", (sorular) => {
      sorular.increments("soru_id");
      sorular.string("soru_name", 64).notNullable().unique();
    })

    .createTable("users", (users) => {
      users.increments("user_id");
      users.string("username", 128).notNullable().unique();
      users.string("password", 128).notNullable();
      users
        .integer("role_id")
        .unsigned()
        .notNullable()
        .references("role_id")
        .inTable("roles")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
      users
        .integer("soru_id")
        .unsigned()
        .notNullable()
        .references("soru_id")
        .inTable("sorular")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
      users.string("soru_cevap", 128).notNullable();
    })
    .createTable("follow", (follow) => {
      follow.increments("follow_id");
      follow.string("combine_user_id");
      follow
        .integer("from_user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      follow
        .integer("to_user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })

    .createTable("tweets", (tweets) => {
      tweets.increments("tweet_id");
      tweets.string("tweet_content", 128).notNullable();
      tweets
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("comments", (comments) => {
      comments.increments("comment_id");
      comments.string("comment_content", 128).notNullable();
      comments
        .integer("from_user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      comments
        .integer("tweet_id")
        .unsigned()
        .notNullable()
        .references("tweet_id")
        .inTable("tweets")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("favs", (favs) => {
      favs.increments("fav_id");
      favs.string("combine_fav_id");
      favs
        .integer("from_user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      favs
        .integer("tweet_id")
        .unsigned()
        .notNullable()
        .references("tweet_id")
        .inTable("tweets")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("favs")
    .dropTableIfExists("comments")
    .dropTableIfExists("tweets")
    .dropTableIfExists("follow")
    .dropTableIfExists("users")
    .dropTableIfExists("sorular")
    .dropTableIfExists("roles");
};
