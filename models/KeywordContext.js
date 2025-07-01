module.exports = class KeywordContext {
  constructor() {
    this.chars = 50; // Number of characters to show before and after the keyword
  }

  find(haystack, needle, chars = this.chars) {
    this.chars = chars; // Allow dynamic setting of chars
    if (typeof haystack !== 'string' || typeof needle !== 'string') {
      throw new Error('Both haystack and needle must be strings');
    }
    const regex = new RegExp(
      `(?<pre>.{0,${this.chars}})(?<keyword>${needle})(?<post>.{0,${this.chars}})`,
      'gi'
    );
    const matches = Array.from(haystack.matchAll(regex)).map((m) => ({
      pre: m.groups.pre,
      keyword: m.groups.keyword,
      post: m.groups.post,
    }));
    if (matches.length > 0) {
      return matches;
    }
    // If no matches found, return an empty array
    return [];
  }
};
