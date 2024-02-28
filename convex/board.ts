import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];

/**
 * Api endpoint to create a board.
 * The function requires two arguments,
 *   orgId of type string and
 *   title of type string.
 * The function 'create' will check if the user has logged in or not.
 * If the use has not logged in, it will throw an Error.
 * Otherwise, it will create a board.
 */
export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

/**
 * Api endpoint for removing a board.
 * The function requires one argument
 *   board id
 * The function 'remove' will check if the user has logged in.
 * If the user has not logged in, it will throw an error.
 * Otherwise, it will remove the board.
 */
export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    // To delete favorite relation
    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    await ctx.db.delete(args.id);
  },
});

/**
 * Api endpoint for updating the title of a board.
 * The function requires two arguments
 *   board id and
 *   title of type string
 * The function 'update' will check if the user has logged in.
 * If the user has not logged in, it will throw an error.
 * The function 'update' will also check if the title is provided.
 * If the title is not provided, it will throw an error.
 * The function 'update' will also check if the characters of the title is more than 60.
 * If the characters are more than 60, it will throw an error.
 * Otherwise, it will update the title of the board.
 */
export const update = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters.");
    }

    const board = await ctx.db.patch(args.id, { title: args.title });

    return board;
  },
});

/**
 * Api endpoint for favoriting a board.
 * The function requires two arguments
 *   board id and
 *   orgId of type string
 * The function 'favorite' will check if the user has logged in.
 * If the user has not logged in, it will throw an error.
 * The function 'favorite' will also check if the board exists.
 * If the board does not exist, it will throw an error.
 * The function 'favorite' will also check if the board has already been favorited.
 * If the board has already been favorited, it will throw an error.
 * Otherwise, it will favorite the board.
 */
export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, arg) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(arg.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    // To check if the user has already favorited the board
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Board already favorited");
    }

    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: arg.orgId,
    });

    return board;
  },
});

/**
 * Api endpoint to unfavorite a board.
 * The function requires two arguments
 *   board id and
 *   orgId of type string
 * The function 'unfavorite' will check if the user has logged in.
 * If the user has not logged in, it will throw an error.
 * The function 'unfavorite' will also check if the board exists.
 * If the board does not exist, it will throw an error.
 * The function 'unfavorite' will also check if the board has already been favorited.
 * If the board has not already been favorited, it will throw an error.
 * Otherwise, it will unfavorite the board.
 */
export const unfavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, arg) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(arg.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    // To check if the user has already favorited the board
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Favorited board not found");
    }

    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});

/**
 * Api endpoint to get a board with the given id.
 * The function 'get' requires one argument.
 *   board id.
 * The function will return the board with the given id.
 */
export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.id);

    return board;
  },
});
