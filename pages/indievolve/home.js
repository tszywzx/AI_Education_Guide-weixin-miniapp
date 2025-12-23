"use strict";
const e = require("../../common/vendor.js");
const t = {
    data: () => ({
        searchText: "",
        searchPlaceholder: "我想准备一节 / 一门……",
        filterType: "all",
        quickItems: [{
            name: "个性化评语",
            icon: "✨",
            colorClass: "text-green",
            bgClass: "bg-green",
            id: "1.13"
        }, {
            name: "高效备课",
            icon: "🖊️",
            colorClass: "text-pink",
            bgClass: "bg-pink",
            id: "1.2"
        }, {
            name: "高效出题",
            icon: "❓",
            colorClass: "text-purple",
            bgClass: "bg-purple",
            id: "1.4"
        }, {
            name: "做一个项目学习",
            icon: "📋",
            colorClass: "text-blue",
            bgClass: "bg-blue",
            id: "2.2"
        }],
        categories: [{
            id: "1.2",
            title: "高效备课",
            subtitle: "从课标分析到教案课件，一站式备齐",
            icon: "🖊️",
            type: "teaching",
            isWeb: !0,
            colorClass: "text-pink",
            bgClass: "bg-pink"
        }, {
            id: "2.1",
            title: "做一门校本课",
            subtitle: "生成主题、单元规划与课时安排",
            icon: "📖",
            type: "teaching",
            colorClass: "text-green",
            bgClass: "bg-green"
        }, {
            id: "2.2",
            title: "做一个项目学习",
            subtitle: "生成驱动性问题、评价量表与流程",
            icon: "📋",
            type: "teaching",
            colorClass: "text-blue",
            bgClass: "bg-blue"
        }, {
            id: "1.4",
            title: "高效出题",
            subtitle: "根据知识点快速生成试题与解析",
            icon: "❓",
            type: "teaching",
            colorClass: "text-purple",
            bgClass: "bg-purple"
        }, {
            id: "1.7",
            title: "解题思路与答案",
            subtitle: "拍照/输入题目，生成多维度解析",
            icon: "💡",
            type: "teaching",
            colorClass: "text-orange",
            bgClass: "bg-orange"
        }, {
            id: "1.13",
            title: "个性化评语",
            subtitle: "支持批量生成、多种教育风格",
            icon: "✨",
            type: "management",
            colorClass: "text-green",
            bgClass: "bg-green"
        }, {
            id: "3.3",
            title: "学生选科指导",
            subtitle: "基于学生优势提供科学选科建议",
            icon: "⚖️",
            type: "management",
            colorClass: "text-blue",
            bgClass: "bg-blue"
        }, {
            id: "3.7",
            title: "学生心理疏导",
            subtitle: "提供共情沟通话术与辅导策略",
            icon: "💗",
            type: "management",
            colorClass: "text-pink",
            bgClass: "bg-pink"
        }, {
            id: "3.8",
            title: "处理学生矛盾",
            subtitle: "基于非暴力沟通的调解方案",
            icon: "🤝",
            type: "management",
            colorClass: "text-blue",
            bgClass: "bg-blue"
        }, {
            id: "2.3",
            title: "社团课程设计",
            subtitle: "规划学期社团主题与活动方案",
            icon: "👥",
            type: "teaching",
            colorClass: "text-orange",
            bgClass: "bg-orange"
        }, {
            id: "2.4",
            title: "公开课比赛",
            subtitle: "打磨说课稿与逐字稿，优化教学环节",
            icon: "🏆",
            type: "growth",
            isWeb: !0,
            colorClass: "text-purple",
            bgClass: "bg-purple"
        }, {
            id: "4.2",
            title: "教学研究论文撰写",
            subtitle: "生成论文大纲、参考文献与写作建议",
            icon: "📝",
            type: "growth",
            isWeb: !0,
            colorClass: "text-blue",
            bgClass: "bg-blue"
        }, {
            id: "5.1",
            title: "行政工作",
            subtitle: "日常行政事务高效处理",
            icon: "📂",
            type: "admin",
            colorClass: "text-orange",
            bgClass: "bg-orange"
        }]
    }),
    computed: {
        filteredCategories() {
            return "all" === this.filterType ? this.categories : this.categories.filter((e => e.type === this.filterType))
        },
        userStats() {
            return this.$store.state
        },
        userInfo() {
            return this.$store.state.userInfo
        },
        hasLogin() {
            return this.$store.state.hasLogin
        },
        greeting() {
            const e = (new Date).getHours();
            return e < 6 ? "凌晨好" : e < 9 ? "早上好" : e < 12 ? "上午好" : e < 14 ? "中午好" : e < 17 ? "下午好" : e < 19 ? "傍晚好" : "晚上好"
        }
    },
    methods: {
        setFilter(event) {
            this.filterType = event.currentTarget.dataset.type
        },
        navigateToScene(arg) {
            let t = "";
            t = "string" == typeof arg ? arg : arg.currentTarget.dataset.id;
            console.log("Navigating to:", t);
            if (t) {
                e.index.navigateTo({
                    url: `/pages/indievolve/scene_detail?id=${t}`
                })
            }
        },
        openTutorial() {
            e.index.navigateTo({
                url: "/pages/indievolve/tutorial"
            })
        },
        handleQuickItem(event) {
            console.log('[DEBUG] handleQuickItem called');
            console.log('[DEBUG] event:', event);
            console.log('[DEBUG] event.currentTarget:', event.currentTarget);
            console.log('[DEBUG] event.currentTarget.dataset:', event.currentTarget.dataset);
            let id = event.currentTarget.dataset.id;
            console.log('[DEBUG] Extracted id:', id);
            this.navigateToScene(id)
        },
        handleCategory(event) {
            console.log('[DEBUG] handleCategory called');
            console.log('[DEBUG] event:', event);
            console.log('[DEBUG] event.currentTarget.dataset:', event.currentTarget.dataset);
            let id = event.currentTarget.dataset.id;
            console.log('[DEBUG] Extracted id:', id);
            this.navigateToScene(id)
        },
        onSearchInput(event) {
            this.searchText = event.detail.value
        },
        onSearch() {
            if (!this.searchText.trim()) return;
            console.log("Searching for:", this.searchText);
            
            e.index.showToast({
                title: '正在搜索...',
                icon: 'loading'
            });
            
            setTimeout(() => {
                e.index.hideToast();
                e.index.navigateTo({
                    url: `/pages/indievolve/scene_detail?id=ai_assistant&initialPrompt=${encodeURIComponent(this.searchText)}`
                })
            }, 500);
        },
        onVoiceTap() {
            const that = this;
            e.index.getSetting({
                success(res) {
                    if (!res.authSetting['scope.record']) {
                        e.index.authorize({
                            scope: 'scope.record',
                            success() {
                                that.startRecording();
                            },
                            fail() {
                                e.index.showModal({
                                    title: '提示',
                                    content: '需要麦克风权限才能使用语音输入',
                                    showCancel: false
                                })
                            }
                        })
                    } else {
                        that.startRecording();
                    }
                }
            })
        },
        startRecording() {
            const rm = e.index.getRecorderManager();
            e.index.showToast({
                title: '请说话...',
                icon: 'none',
                duration: 60000 
            });
            
            rm.onStop((res) => {
                e.index.hideToast();
                const { tempFilePath } = res;
                console.log('Recording stopped', tempFilePath);
                
                e.index.showLoading({ title: '识别中...' });
                setTimeout(() => {
                    e.index.hideLoading();
                    this.searchText = "帮我生成一份教案"; // Mock Result
                    e.index.showToast({ title: '识别成功', icon: 'success' });
                }, 1000);
            });
            
            rm.start({
                format: 'mp3'
            });
            
            setTimeout(() => {
                rm.stop();
            }, 3000);
        }
    }
};
const s = e._export_sfc(t, [
    ["render", function(t, s, a, o, n, i) {
        return {
            greeting: i.greeting,
            userInfo: i.userInfo,
            userStats: i.userStats,
            hasLogin: i.hasLogin,
            searchText: n.searchText,
            searchPlaceholder: n.searchPlaceholder,
            quickItems: n.quickItems,
            filteredCategories: i.filteredCategories,
            filterType: n.filterType,
            handleSearchInput: e.o((e => i.onSearchInput(e))),
            handleSearch: e.o((e => i.onSearch(e))),
            handleVoice: e.o((e => i.onVoiceTap(e))),
            handleQuickItem: e.o((e => i.handleQuickItem(e))),
            handleCategory: e.o((e => i.handleCategory(e))),
            navigateToScene: e.o((e => i.navigateToScene(e))),
            openTutorial: e.o((e => i.openTutorial(e))),
            handleFilter: e.o((e => i.setFilter(e)))
        }
    }],
    ["__scopeId", "data-v-2c4ddb6f"]
]);
wx.createPage(s);
