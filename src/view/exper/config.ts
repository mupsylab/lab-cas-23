import { JsPsych } from "@/utils/jsPsych/jsPsych";

export const exp1Words = [
    "叫喊",
    "转身离去",
    "赛跑",
    "睁大眼睛",
    "哭泣",
    "跳跃",
    "生病",
    "愤怒",
    "恶心",
    "冷静",
    "头痛",
    "尖叫",
    "出汗",
    "紧张",
    "热",
    "温暖",
    "喜爱",
    "微笑",
    "兴奋",
    "大笑",
];

export const exp1Dims = [
    "愤怒",
    "恐惧",
    "快乐",
    "悲伤"
];

export const exp2TimeVars = (function () {
    const res: Array<{ face: string, bgs: Array<string> }> = [];
    ["f", "m"].forEach(i1 => {
        [1, 2, 3, 4, 5, 6, 7, 8].forEach(i2 => {
            const emotions = ["happy", "fear", "angry", "sad"];
            ["happy"].forEach(i3 => {
                emotions.splice(emotions.indexOf(i3), 1);
                emotions.forEach(i4 => {
                    res.push({
                        face: `${i3}-${i1}${i2}`,
                        bgs: JsPsych.plugin.random.shuffle([`b_${i3}`, `b_${i4}`])
                    });
                });
            });
        });
    });
    return res;
})();




