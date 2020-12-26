module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/f',
        permanent: true,
      },
      {
        source: '/@/:persona',
        destination: '/@:persona',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/@:persona',
        destination: '/@/:persona',
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
