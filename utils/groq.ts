const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateArticle(cardText: string, cardText2?: string): Promise<string> {
  const content = cardText2 ? `${cardText}\n${cardText2}` : cardText;
  
  const prompt = `请以"${content}"为主题，写一篇深度解读文章。

要求：
1. 字数500字左右，文笔优美，富有文采
2. 语言要有说服力、感染力和气势，能打动人心
3. 引用3个古今中外的历史故事或人物事迹，作为论据支撑观点
4. 结尾给出3句意境相近的名言警句
5. 行文要有起承转合，层次分明

请直接输出文章，不要标题和额外说明。`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error('AI 生成失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export function saveArticleToFile(cardText: string, article: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `article_${timestamp}.txt`;
  
  const content = `主题: ${cardText}\n生成时间: ${new Date().toLocaleString('zh-CN')}\n\n${article}`;
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
