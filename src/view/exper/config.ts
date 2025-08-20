import { Ques } from "@/component/questionnaire/Questionnaire";
import { JsPsych } from "@/utils/jsPsych/jsPsych";

export const S3Auth = {
    accessKey: "CVx5X2pqH8U8edrUCzlV",
    secretKey: "sJIDFX5asll6PckUtlWlbatqTyxAKPsJM8fTHa4g"
}

export const partInfo: Array<Ques> = [
    { name: "desc", type: "desc", desc: "<h2>一、孩子信息</h2>" },
    { name: "name", type: "text", title: "姓名", placeholder: "请输入您孩子的姓名", valid: [{ required: true }] },
    { name: "gender", type: "radio", title: "性别", choices: ["男", "女"], valid: [{ required: true }] },
    { name: "birth", type: "date", title: "出生日期", valid: [{ required: true }] },
    {
        name: "idcard", type: "text", title: "身份证后六位", placeholder: "请输入您的身份证后六位", valid: [
            { required: true },
            {
                validator: (_rule: any, value: string, callback: any) => {
                    if (value.length == 6 && (/^\d{5}[\dxX]$/.test(value))) {
                        callback();
                    } else {
                        callback(new Error("请输入正确的身份证后六位"));
                    }
                }, trigger: 'blur'
            }
        ]
    },
    { name: "desc", type: "desc", desc: "<h2>二、家长信息（选填）</h2>" },
    { name: "p_name", type: "text", title: "您的姓名", placeholder: "请输入您的姓名" },
    { name: "p_gender", type: "radio", title: "您的性别", choices: ["男", "女"] },
    { name: "p_birth", type: "date", title: "请选择您的出生年月日" },
];

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
    "悲伤",
    "惊讶",
    "厌恶"
];

export const faceImgs: Array<[string, string]> = [
    ["h1-happy", "./assets/imgs/Y39F-25_happy.jpg"],
    ["h1-sad", "./assets/imgs/Y39F-25_sad.jpg"],
    ["h1-fear", "./assets/imgs/Y39F-25_fear.jpg"],
    ["h1-angry", "./assets/imgs/Y39F-25_anger.jpg"],
    ["h1-surprise", "./assets/imgs/Y39F-25_surprise.jpg"],
    ["h1-disgust", "./assets/imgs/Y39F-25_disgust.jpg"],
    ["h2-happy", "./assets/imgs/Y58M-22_happy.jpg"],
    ["h2-sad", "./assets/imgs/Y58M-22_sad.jpg"],
    ["h2-fear", "./assets/imgs/Y58M-22_fear.jpg"],
    ["h2-angry", "./assets/imgs/Y58M-22_anger.jpg"],
    ["h2-surprise", "./assets/imgs/Y58M-22_surprise.jpg"],
    ["h2-disgust", "./assets/imgs/Y58M-22_disgust.jpg"],
];

export const exp2TimeVars = (function () {
    const res: Array<{ face: string, bgs: Array<string> }> = [];
    ["h"].forEach(i1 => {
        [1, 2].forEach(i2 => {
            ["happy", "sad", "fear", "angry", "surprise", "disgust"].forEach(i3 => {
                const emotions = ["happy", "sad", "fear", "angry", "surprise", "disgust"];
                emotions.splice(emotions.indexOf(i3), 1);
                emotions.forEach(i4 => {
                    res.push({
                        face: `${i1}${i2}-${i3}`,
                        bgs: JsPsych.plugin.random.shuffle([`b_${i3}`, `b_${i4}`])
                    });
                });
            });
        });
    });
    return res;
})();

export const exp3TimeVars = (function () {
    const res: Array<{ face: string, bgs: Array<string> }> = [];
    /**
     * 拖动的面孔情绪
     */
    ["happy", "sad", "fear", "angry", "surprise", "disgust"].forEach(e1 => {
        /**
         * 不匹配的面孔情绪
         */
        const emotions = ["happy", "sad", "fear", "angry", "surprise", "disgust"];
        emotions.splice(emotions.indexOf(e1), 1);
        emotions.forEach(e2 => {
            for (let f1 = 1; f1 <= 2; f1++) {
                /**
                 * 拖动面孔特征序号
                 */
                for (let f2 = 1; f2 <= 2; f2++) {
                    /**
                     * 固定面孔特征序号1
                     */
                    if (f1 === f2) continue;
                    res.push({
                        face: `h${f1}-${e1}`,
                        bgs: JsPsych.plugin.random.shuffle([`h${f2}-${e1}`, `h${f2}-${e2}`])
                    });
                }
            }
        });
    });
    return res;
})();

export const exp4TimeVars = (function () {
    /**
     * 6 * 5 共30种情绪
     * 序列需要12个图片
     * 所以detection图片位置需要在 [4, 8]之间
     * rsvp间隔参数 2, 3, 4
     */
    const res: Array<{
        imgs: Array<string>,
        seq: Array<number>,
        detection: number,
        rsvp_iti: number
    }> = [];    
    ["h1", "h2"].forEach(face => {
        ["happy", "sad", "fear", "angry", "surprise", "disgust"].forEach(e1 => {
            const emotions = ["happy", "sad", "fear", "angry", "surprise", "disgust"];
            emotions.splice(emotions.indexOf(e1), 1);
            emotions.forEach(e2 => {
                [6].forEach(i1 => {
                    [2, 3, 5].forEach(i2 => {
                        const seq: Array<number> = [];
                        for (let i = 0; i < 12; i++) {
                            if (i + 1 == i1) seq.push(0)
                            else if (i + 1 == i1 + i2) seq.push(-1)
                            else seq.push(1);
                        }
                        res.push({
                            imgs: [`${face}-${e1}`, `${face}-${e2}`],
                            seq: seq,
                            detection: i1 - 1,
                            rsvp_iti: i2
                        });
                    });
                });
            });
        });
    });
    console.log(res);
    return res;
})();

export function save_csv(data: string, filename: string) {
    // 在实验结束时自动下载数据
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${JsPsych.instance.currTime}_${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
