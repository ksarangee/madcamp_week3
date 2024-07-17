module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier', // 추가
  ],

  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        useTabs: false,
      },
    ],
  },
};
