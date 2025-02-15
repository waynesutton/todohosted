/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as cleanup from "../cleanup.js";
import type * as config from "../config.js";
import type * as crons from "../crons.js";
import type * as messages from "../messages.js";
import type * as pageMessages from "../pageMessages.js";
import type * as pageTodos from "../pageTodos.js";
import type * as pages from "../pages.js";
import type * as todos from "../todos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  cleanup: typeof cleanup;
  config: typeof config;
  crons: typeof crons;
  messages: typeof messages;
  pageMessages: typeof pageMessages;
  pageTodos: typeof pageTodos;
  pages: typeof pages;
  todos: typeof todos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
