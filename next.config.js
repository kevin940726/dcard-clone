module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/f',
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      'megapx-assets.dcard.tw',
      'i.imgur.com',
      'imgur.com',
      'vivid.dcard.tw',
      'www.dcard.tw',
      'megapx.dcard.tw',
      'imgur.dcard.tw',
      'img.youtube.com',
      'pbs.twimg.com',
    ],
  },
};
