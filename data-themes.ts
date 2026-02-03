// Multi-theme data structure
import { ThemeType } from './types';

// Original quit-porn data
export interface QuitPornItem {
  id: number;
  uuid: string;
  content_cn: string;
  content_en: string;
}

// Quote data (like Hanfeizi)
export interface QuoteItem {
  id: string;
  originalText: string;
  translation: string;
  source: string;
  notes?: string;
  appreciation?: string;
}

// Reading notes data (placeholder for future)
export interface ReadingNoteItem {
  id: string;
  title: string;
  content: string;
  author?: string;
  book?: string;
}

// Unified theme data interface
export interface ThemeData {
  id: string;
  text: string;
  text2?: string;
  source?: string;
}

// Import original quit-porn data
import { SOURCE_DATA as QUIT_PORN_RAW } from './data';

// Transform quit-porn data - only Chinese, no English
export const QUIT_PORN_DATA: ThemeData[] = QUIT_PORN_RAW.map(item => ({
  id: `qp_${item.id}`,
  text: item.content_cn,
  // Don't include text2 for quit-porn theme, only show Chinese
}));

// Hanfeizi quotes data
export const HANFEIZI_QUOTES: QuoteItem[] = [
  {
    id: "hanfeizi_1769878690213_0",
    originalText: "以人言善我，必以人言罪我。",
    source: "韩非子·说林上",
    translation: "因为他人的话才对我友好，也一定会因为他人的话来怪罪我。",
    notes: "罪：怪罪。",
    appreciation: "此句告诫人们不要过于在意他人的评价，外界的评价往往是主观的、多变的，强调了保持独立思考和坚定信念的重要性。"
  },
  {
    id: "hanfeizi_1769878693383_1",
    originalText: "志之难也，不在胜人，在自胜也。",
    source: "韩非子·喻老",
    translation: "立志困难，不在于胜过别人，而在于胜过自己。",
    notes: "自胜：战胜自己，指克制自己。",
    appreciation: "此句体现了一种自我克服和自我超越的价值观，鼓励人们要有自信，克服自身的缺陷，以实现个人的理想和目标。"
  },
  {
    id: "hanfeizi_1769878696684_2",
    originalText: "凡失其所欲之路而妄行者之谓迷，迷则不能至于其所欲至矣。",
    source: "韩非子·解老",
    translation: "凡是离开他想走的路而乱走的，就叫做迷失；迷失就不能到达他想到达的地方了。",
    notes: "妄行：随便行动。",
    appreciation: "此句阐明了迷的现象，一个人背离理想，背弃道义，在邪恶的路上执迷不悟。"
  },
  {
    id: "hanfeizi_1769878700042_10",
    originalText: "人行事施予，以利之为心，则越人易和；以害之为心，则父子离且怨。",
    source: "韩非子·外储说左上",
    translation: "人们在做事情和对待他人时，如果以利于他人为出发点，即使是疏远的人也容易和睦相处；但如果以损害他人为出发点，即使是父子之间也会疏远甚至产生怨恨。",
    notes: "越人：指居住在我国浙江等东南沿海地区的越族人，这里比喻关系疏远的人。",
    appreciation: "与他人相处，应抱有宽容大度的态度，这样才能与他人和睦相处，如果只谋求个人利益，而损害他人的利益，就会出现人人自危的局面。"
  },
  {
    id: "hanfeizi_1769878703185_11",
    originalText: "不明察，不能烛私；能法之士，必强毅而劲直，不劲直，不能矫奸。",
    source: "韩非子·孤愤",
    translation: "不明察秋毫，就不能洞察隐私。能够推行法治的人，必定是坚决果断并刚强正直的；不刚强正直，就不能惩治奸邪。",
    notes: "烛：洞悉。劲直：刚强正直。矫：纠正，把弯曲的弄直。",
    appreciation: "此句说明执法者必须具备明察秋毫的能力，以及坚毅果决的节操。"
  },
  {
    id: "hanfeizi_1769878706327_12",
    originalText: "外举不避仇，内举不避子。",
    source: "韩非子·外储说左下",
    translation: "举荐外人时不回避自己的仇人，举荐亲信时不回避自己的孩子。",
    notes: "举：推荐。",
    appreciation: "此句体现出去私就公的思想，在任用官员方面，主张选贤举能，论功录用，唯才是举。"
  },
  {
    id: "hanfeizi_1769878709642_20",
    originalText: "布帛寻常，庸人不释",
    source: "韩非子·五蠹",
    translation: "普通的布帛虽然仅有寻、常那样长，一般百姓也不肯放开。",
    notes: "布帛：统称供裁制衣着用品的材料。释：放开，放手。",
    appreciation: "这句古语道出了寻常之物的价值所在。即便普通如布帛，也有其珍贵之处，不应被忽视。它提醒我们珍视平凡生活中的美好，发现其中的价值。"
  },
  {
    id: "hanfeizi_1769878712780_21",
    originalText: "治民者，禁奸于未萌",
    source: "韩非子·心度",
    translation: "统治人民的人，应在邪恶的事情尚未萌芽时便有所禁止。",
    notes: "禁奸：惩治奸邪。未萌：指事情发生以前。",
    appreciation: "这句话强调了治理民众时，预防犯罪的重要性。通过在犯罪行为尚未萌芽时就加以禁止，可以有效维护社会秩序和稳定，体现了前瞻性和预防为主的治理理念。"
  },
  {
    id: "hanfeizi_1769878715954_22",
    originalText: "私行胜则少公功。",
    source: "韩非子·外储说左下",
    translation: "以权谋私的行为盛行，就很少有人为国立功。",
    notes: "胜：超过，占优势。",
    appreciation: "这句诗深刻阐述了个人行为与公共利益之间的关系。过于追求私利，必然损害公共利益。"
  }
];

// Transform quotes data
export const QUOTES_DATA: ThemeData[] = HANFEIZI_QUOTES.map(item => ({
  id: item.id,
  text: item.originalText,
  text2: item.translation,
  source: item.source,
}));

// Placeholder reading notes data
export const READING_DATA: ThemeData[] = [
  {
    id: 'reading_1',
    text: '读书不觉已春深，一寸光阴一寸金。',
    text2: '专注读书时不知不觉春天已深，时间如金子般珍贵。',
    source: '王贞白《白鹿洞二首·其一》',
  },
  {
    id: 'reading_2',
    text: '书山有路勤为径，学海无涯苦作舟。',
    text2: '在知识的山峰上，勤奋是攀登的道路；在学问的海洋里，刻苦是前进的船只。',
    source: '韩愈',
  },
  {
    id: 'reading_3',
    text: '读书破万卷，下笔如有神。',
    text2: '读书读得多了，写文章时就会文思泉涌，如有神助。',
    source: '杜甫《奉赠韦左丞丈二十二韵》',
  },
  {
    id: 'reading_4',
    text: '黑发不知勤学早，白首方悔读书迟。',
    text2: '年轻时不知道勤奋学习，到老了才后悔读书太晚。',
    source: '颜真卿《劝学诗》',
  },
  {
    id: 'reading_5',
    text: '纸上得来终觉浅，绝知此事要躬行。',
    text2: '从书本上得到的知识终究是浅薄的，要真正理解必须亲身实践。',
    source: '陆游《冬夜读书示子聿》',
  },
  {
    id: 'reading_6',
    text: '三更灯火五更鸡，正是男儿读书时。',
    text2: '每天三更半夜到鸡啼报晓时，是男子汉们读书的最好时间。',
    source: '颜真卿《劝学》',
  },
  {
    id: 'reading_7',
    text: '读书之法，在循序而渐进，熟读而精思。',
    text2: '读书的方法，在于按照顺序逐步前进，反复阅读并深入思考。',
    source: '朱熹',
  },
  {
    id: 'reading_8',
    text: '立身以立学为先，立学以读书为本。',
    text2: '树立自身品德以学习为首要，学习则以读书为根本。',
    source: '欧阳修',
  },
  {
    id: 'reading_9',
    text: '书犹药也，善读之可以医愚。',
    text2: '书就像药一样，善于读书可以医治愚昧。',
    source: '刘向',
  },
  {
    id: 'reading_10',
    text: '读万卷书，行万里路。',
    text2: '要努力读书，让自己的才识过人并让自己的所学，能在实践中体现。',
    source: '刘彝',
  },
  {
    id: 'reading_11',
    text: '旧书不厌百回读，熟读精思子自知。',
    text2: '经典的书要反复阅读，熟读之后仔细思考，自然就能领会其中的道理。',
    source: '苏轼',
  },
  {
    id: 'reading_12',
    text: '书到用时方恨少，事非经过不知难。',
    text2: '知识总是在运用时才让人感到太不够了，许多事情如果不亲身经历就不知道它有多难。',
    source: '陆游',
  },
  {
    id: 'reading_13',
    text: '问渠那得清如许，为有源头活水来。',
    text2: '要问池塘里的水为何这样清澈，是因为有永不枯竭的源头活水。比喻只有不断学习，才能保持思想的活跃和进步。',
    source: '朱熹《观书有感》',
  },
  {
    id: 'reading_14',
    text: '少年易老学难成，一寸光阴不可轻。',
    text2: '青春的日子容易逝去，学问却很难成功，所以每一寸光阴都要珍惜，不能轻易放过。',
    source: '朱熹《劝学诗》',
  },
  {
    id: 'reading_15',
    text: '非学无以广才，非志无以成学。',
    text2: '不学习就无法增长才干，没有志向就无法使学习有所成就。',
    source: '诸葛亮《诫子书》',
  },
];

// Theme data getter
export function getThemeData(theme: ThemeType): ThemeData[] {
  switch (theme) {
    case 'quit-porn':
      return QUIT_PORN_DATA;
    case 'quotes':
      return QUOTES_DATA;
    case 'reading':
      return READING_DATA;
    default:
      return QUIT_PORN_DATA;
  }
}

// Theme display names
export const THEME_NAMES: Record<ThemeType, { zh: string; en: string }> = {
  'quit-porn': { zh: '戒色', en: 'Quit Porn' },
  'quotes': { zh: '名言', en: 'Quotes' },
  'reading': { zh: '读书', en: 'Reading' },
};
