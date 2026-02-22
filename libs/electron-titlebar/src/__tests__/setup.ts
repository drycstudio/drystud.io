/**
 * Vitest setup file – patches jsdom's CSSStyleSheet.insertRule to tolerate
 * the non-standard tracking rules that @stitches/core injects (e.g. `--sxs{--sxs:6}`).
 *
 * Stitches reads back from `sheet.cssRules[index]` after inserting, so we must
 * ensure a valid CSSRule is actually created.  When the original insertRule
 * rejects a rule, we insert a harmless placeholder instead.
 */
const originalInsertRule = CSSStyleSheet.prototype.insertRule;
CSSStyleSheet.prototype.insertRule = function (rule: string, index?: number): number {
  try {
    return originalInsertRule.call(this, rule, index);
  } catch {
    try {
      return originalInsertRule.call(this, ':root {}', index);
    } catch {
      return index ?? 0;
    }
  }
};
