exports.up = function (knex) {
  return knex.schema
    .createTable("roles", (roles) => {
      roles.increments("role_id");
      roles.string("role_name", 32).notNullable().unique();
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
    })
    .createTable("follow", (follow) => {
      follow.increments("follow_id");
      follow
        .integer("from_user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
      follow
        .integer("to_user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
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
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
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
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
      comments
        .integer("tweet_id")
        .unsigned()
        .notNullable()
        .references("tweet_id")
        .inTable("tweets")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
    })
    .createTable("favs", (comments) => {
      comments.increments("fav_id");
      comments
        .integer("from_user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
      comments
        .integer("tweet_id")
        .unsigned()
        .notNullable()
        .references("tweet_id")
        .inTable("tweets")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("comments")
    .dropTableIfExists("tweets")
    .dropTableIfExists("follow")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
