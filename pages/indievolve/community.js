Page({
  data: {
    activeTab: 'discover',
    feed: [
      {
        id: '0',
        author: '小树内容团队',
        avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwBHJrRn5sz76hQ339wc65pW7k99B8Z8qFk1x7elP5K6X7w/0',
        type: 'ai_case',
        isOfficial: true,
        title: '【官方严选】2024春季学期末评语生成指南',
        description: '由内容专家王雪霏老师优化提示词，针对不同学段（高/初/小）进行了风格微调，准确率提升30%。',
        tags: ['官方教程', '置顶'],
        likes: 1205,
        downloads: 3400,
        time: '置顶'
      },
      {
        id: '1',
        author: '王雪霏',
        avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwBHJrRn5sz76hQ339wc65pW7k99B8Z8qFk1x7elP5K6X7w/0',
        type: 'ai_case',
        isOfficial: true,
        title: '高一期末评语-成长型思维版',
        description: '使用【个性化评语】场景生成的，重点关注了学生的进步过程，家长反馈很暖心。',
        tags: ['期末评语', '高中'],
        likes: 128,
        downloads: 450,
        time: '2小时前'
      }
    ],
    filteredFeed: []
  },

  onLoad: function (options) {
    this.updateFilter();
  },

  setActiveTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
    this.updateFilter();
  },

  updateFilter: function() {
    let list = this.data.feed;
    if (this.data.activeTab === 'official') {
      list = list.filter(item => item.isOfficial);
    }
    this.setData({
      filteredFeed: list
    });
  }
});
