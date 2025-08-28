// .eslintrc.cjs
module.exports = {
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "react-hooks/rules-of-hooks": "warn", // временно как warning
    "@next/next/no-img-element": "off",
    // удобно, чтобы строки вроде "use client" не ругались, если вдруг не в самом верху
    "@typescript-eslint/no-unused-expressions": "warn",
  },
};
