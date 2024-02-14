import { v } from "convex/values";
import { mutation } from "./_generated/server";

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

    // TODO: Later check to delete favorite relation

    await ctx.db.delete(args.id);
  },
});
