import { JsPsych } from "@/utils/jsPsych/jsPsych";

export const S3Auth = {
    accessKey: "CVx5X2pqH8U8edrUCzlV",
    secretKey: "sJIDFX5asll6PckUtlWlbatqTyxAKPsJM8fTHa4g"
}

export const partInfo = [
    { name: "name", type: "text", title: "您的姓名", placeholder: "请输入您的姓名", valid: [{ required: true }] },
    { name: "gender", type: "radio", title: "您的性别", choices: ["男", "女"], valid: [{ required: true }] },
    { name: "c_name", type: "text", title: "您孩子的姓名", placeholder: "请输入您孩子的姓名" },
    { name: "c_gender", type: "radio", title: "您孩子的性别（如果有）", choices: ["男", "女"] },
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
    { name: "birth", type: "date", title: "请选择您的出生年月日", valid: [{ required: true }] },
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
    ["h1-happy", "./assets/imgs/IMG0007.jpg"],
    ["h1-sad", "./assets/imgs/IMG0008.jpg"],
    ["h1-fear", "./assets/imgs/IMG0009.jpg"],
    ["h1-angry", "./assets/imgs/IMG0010.jpg"],
    ["h1-surprise", "./assets/imgs/IMG0011.jpg"],
    ["h1-disgust", "./assets/imgs/IMG0012.jpg"],
    ["h2-happy", "./assets/imgs/IMG0014.jpg"],
    ["h2-sad", "./assets/imgs/IMG0015.jpg"],
    ["h2-fear", "./assets/imgs/IMG0016.jpg"],
    ["h2-angry", "./assets/imgs/IMG0018.jpg"],
    ["h2-surprise", "./assets/imgs/IMG0019.jpg"],
    ["h2-disgust", "./assets/imgs/IMG0020.jpg"],
    // ["h3-happy", "./assets/imgs/IMG0022.jpg"],
    // ["h3-sad", "./assets/imgs/IMG0023.jpg"],
    // ["h3-fear", "./assets/imgs/IMG0024.jpg"],
    // ["h3-angry", "./assets/imgs/IMG0025.jpg"],
    // ["h3-surprise", "./assets/imgs/IMG0026.jpg"],
    // ["h3-disgust", "./assets/imgs/IMG0027.jpg"],
    // ["h4-happy", "./assets/imgs/IMG0034.jpg"],
    // ["h4-sad", "./assets/imgs/IMG0036.jpg"],
    // ["h4-fear", "./assets/imgs/IMG0037.jpg"],
    // ["h4-angry", "./assets/imgs/IMG0038.jpg"],
    // ["h4-surprise", "./assets/imgs/IMG0039.jpg"],
    // ["h4-disgust", "./assets/imgs/IMG0040.jpg"],
    // ["h5-happy", "./assets/imgs/IMG0048.jpg"],
    // ["h5-sad", "./assets/imgs/IMG0049.jpg"],
    // ["h5-fear", "./assets/imgs/IMG0050.jpg"],
    // ["h5-angry", "./assets/imgs/IMG0052.jpg"],
    // ["h5-surprise", "./assets/imgs/IMG0054.jpg"],
    // ["h5-disgust", "./assets/imgs/IMG0055.jpg"],
    // ["h6-happy", "./assets/imgs/IMG0057.jpg"],
    // ["h6-sad", "./assets/imgs/IMG0058.jpg"],
    // ["h6-fear", "./assets/imgs/IMG0059.jpg"],
    // ["h6-angry", "./assets/imgs/IMG0061.jpg"],
    // ["h6-surprise", "./assets/imgs/IMG0063.jpg"],
    // ["h6-disgust", "./assets/imgs/IMG0064.jpg"],
    // ["h7-happy", "./assets/imgs/IMG0066.jpg"],
    // ["h7-sad", "./assets/imgs/IMG0067.jpg"],
    // ["h7-fear", "./assets/imgs/IMG0068.jpg"],
    // ["h7-angry", "./assets/imgs/IMG0069.jpg"],
    // ["h7-surprise", "./assets/imgs/IMG0070.jpg"],
    // ["h7-disgust", "./assets/imgs/IMG0071.jpg"],
    // ["h8-happy", "./assets/imgs/IMG0074.jpg"],
    // ["h8-sad", "./assets/imgs/IMG0075.jpg"],
    // ["h8-fear", "./assets/imgs/IMG0078.jpg"],
    // ["h8-angry", "./assets/imgs/IMG0080.jpg"],
    // ["h8-surprise", "./assets/imgs/IMG0081.jpg"],
    // ["h8-disgust", "./assets/imgs/IMG0082.jpg"],
    // ["h9-happy", "./assets/imgs/IMG0084.jpg"],
    // ["h9-sad", "./assets/imgs/IMG0087.jpg"],
    // ["h9-fear", "./assets/imgs/IMG0088.jpg"],
    // ["h9-angry", "./assets/imgs/IMG0089.jpg"],
    // ["h9-surprise", "./assets/imgs/IMG0090.jpg"],
    // ["h9-disgust", "./assets/imgs/IMG0091.jpg"],
    // ["h10-happy", "./assets/imgs/IMG0093.jpg"],
    // ["h10-sad", "./assets/imgs/IMG0094.jpg"],
    // ["h10-fear", "./assets/imgs/IMG0095.jpg"],
    // ["h10-angry", "./assets/imgs/IMG0096.jpg"],
    // ["h10-surprise", "./assets/imgs/IMG0097.jpg"],
    // ["h10-disgust", "./assets/imgs/IMG0098.jpg"]
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
