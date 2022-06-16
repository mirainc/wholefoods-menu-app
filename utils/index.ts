import * as T from "../types";

export const getTag = (tags: T.Tag[], tagName: string) => {
  const record = tags.find((x) => {
    return x.includes(tagName);
  });

  if (!record) return "";

  const [_tagKey, tagValue] = record.split(":");
  return tagValue;
};
