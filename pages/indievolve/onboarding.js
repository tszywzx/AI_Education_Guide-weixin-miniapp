"use strict";
const e = require("../../common/vendor.js");
const s = {
    data: () => ({
        step: "splash",
        prevStack: []
    }),
    mounted() {
        "splash" === this.step && setTimeout((() => {
            this.step = "welcome"
        }), 3500)
    },
    watch: {
        step(e) {
            "sandbox_2" === e && setTimeout((() => {
                this.step = "sandbox_3"
            }), 3500)
        }
    },
    methods: {
        setStep(e) {
            this.prevStack.push(this.step), this.step = e
        },
        handleBack() {
            const e = this.prevStack.pop();
            e && (this.step = e)
        },
        handleComplete(s) {
            this.$store.commit("completeOnboarding", s), e.index.switchTab({
                url: "/pages/indievolve/home"
            })
        }
    }
};
const o = e._export_sfc(s, [
    ["render", function(s, o, t, p, a, n) {
        return e.e({
            a: "splash" === a.step
        }, (a.step, {}), {
            b: "welcome" === a.step
        }, "welcome" === a.step ? {
            c: e.o((e => n.setStep("sandbox_1"))),
            d: e.o((e => n.setStep("book_ask")))
        } : {}, {
            e: "sandbox_1" === a.step
        }, "sandbox_1" === a.step ? {
            f: e.o((e => n.setStep("book_ask"))),
            g: e.o((e => n.setStep("sandbox_2"))),
            hb: e.o((e => n.handleBack()))
        } : {}, {
            h: "sandbox_2" === a.step
        }, (a.step, {}), {
            i: "sandbox_3" === a.step
        }, "sandbox_3" === a.step ? {
            j: e.o((e => n.setStep("book_ask"))),
            hb: e.o((e => n.handleBack()))
        } : {}, {
            k: "book_ask" === a.step
        }, "book_ask" === a.step ? {
            l: e.o((e => n.setStep("book_yes"))),
            m: e.o((e => n.setStep("book_no"))),
            hb: e.o((e => n.handleBack()))
        } : {}, {
            n: "book_yes" === a.step
        }, "book_yes" === a.step ? {
            o: e.o((e => n.handleComplete(!0))),
            hb: e.o((e => n.handleBack()))
        } : {}, {
            p: "book_no" === a.step
        }, "book_no" === a.step ? {
            q: e.o((e => n.handleComplete(!1))),
            hb: e.o((e => n.handleBack()))
        } : {})
    }],
    ["__scopeId", "data-v-95ccc16c"]
]);
wx.createPage(o);
