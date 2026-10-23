/* ══════════════════════════════════════════════════════════
   quiz-data.js — 题型练习题库
   ──────────────────────────────────────────────────────────
   全部为本项目原创编写，对标四六级真题题型与难度，
   不涉及任何真题版权。三类：
     reading  仔细阅读（选择题）
     cloze    选词填空（15 选 10）
     matching 长篇阅读段落匹配
   ══════════════════════════════════════════════════════════ */

const QUIZ = {

  /* ─────────── 仔细阅读 ─────────── */
  reading: [
    {
      id: 'r-cet4-1',
      level: 'cet4',
      title: 'The Second-Hand Boom',
      passage: [
        'Not long ago, buying second-hand clothes was something people did quietly. A student might admit to shopping at a flea market, but few would mention it in a job interview. Today the situation is very different. Resale platforms have become fashionable, and influencers proudly announce that a jacket cost them a tenth of its original price.',
        'The change has been driven partly by money. For young people facing high rents and uncertain incomes, paying full price for clothing has become harder to justify. But price alone does not explain the enthusiasm. Many buyers describe second-hand shopping as a form of hunting: the pleasure lies not in owning something new, but in finding something unexpected. That sense of discovery is difficult for ordinary shops to offer.',
        'Environmental arguments have also played a role. The fashion industry produces a huge amount of waste, and buying used clothing keeps garments in use for longer. Yet researchers warn that the effect is smaller than it appears. If resale simply encourages people to buy more clothes overall, the total benefit may disappear.',
        'Online platforms have made the market far more efficient. Sellers can photograph an item in seconds, and buyers can search for a specific size and brand. Payment systems hold the money until delivery is confirmed, which reduces the risk of fraud. Ten years ago, such transactions depended almost entirely on trust between strangers.',
        'There are still problems. Sizes vary between brands, so an item that fits perfectly in one label may be useless in another. Photographs can hide damage, and returning goods is often impossible. Some buyers also worry about hygiene, particularly with shoes and hats.',
        'Despite these difficulties, the direction seems clear. Buying used is no longer a sign of financial difficulty; it is increasingly a normal way to shop. What remains to be seen is whether the habit survives once the novelty fades.',
      ],
      questions: [
        {
          q: 'What does the author suggest about second-hand shopping in the past?',
          options: [
            'It was mainly done by wealthy people.',
            'People were reluctant to talk about it openly.',
            'It was illegal in most countries.',
            'It was limited to clothing for children.',
          ],
          answer: 1,
          explain: '第一段开头说 "buying second-hand clothes was something people did quietly"，并举例"很少有人会在面试时提起"，说明过去人们不愿公开承认。A、C、D 文中均无依据。',
        },
        {
          q: 'According to the passage, what attracts many buyers besides low prices?',
          options: [
            'The chance to meet famous influencers.',
            'The possibility of reselling at a profit.',
            'The pleasure of finding something unexpected.',
            'The opportunity to support local shops.',
          ],
          answer: 2,
          explain: '第二段明确指出 "the pleasure lies not in owning something new, but in finding something unexpected"，并把这种体验称为 "a form of hunting"。',
        },
        {
          q: 'Why do researchers doubt the environmental benefit of resale?',
          options: [
            'Used clothes are usually in poor condition.',
            'Resale may lead people to buy more clothes in total.',
            'Most second-hand items are thrown away quickly.',
            'The fashion industry has already reduced its waste.',
          ],
          answer: 1,
          explain: '第三段末尾："If resale simply encourages people to buy more clothes overall, the total benefit may disappear." 即总量增加会抵消环保收益。',
        },
        {
          q: 'What does the author say about online platforms?',
          options: [
            'They have made transactions safer and faster.',
            'They have raised the average price of used clothes.',
            'They are mainly used by professional dealers.',
            'They have replaced traditional shops completely.',
          ],
          answer: 0,
          explain: '第四段讲平台让交易"far more efficient"，支付系统在确认收货前托管资金 "reduces the risk of fraud"，都指向更安全、更高效。D 项 "completely" 过于绝对。',
        },
        {
          q: "What is the author's attitude toward the future of second-hand shopping?",
          options: [
            'Completely optimistic.',
            'Open but uncertain.',
            'Strongly critical.',
            'Indifferent.',
          ],
          answer: 1,
          explain: '末段 "the direction seems clear" 表示趋势明确，但结尾 "What remains to be seen is whether the habit survives once the novelty fades" 保留了不确定，属于开放而谨慎的态度。',
        },
      ],
    },

    {
      id: 'r-cet4-2',
      level: 'cet4',
      title: 'Why Walking Meetings Work',
      passage: [
        'A meeting room with a large table and a screen is the default setting for most offices. Yet a growing number of managers are choosing to hold conversations while walking outside. The idea is simple: instead of sitting opposite each other, two or three people walk side by side for twenty or thirty minutes.',
        'Supporters point to several advantages. Walking side by side removes the direct eye contact that can make people defensive. When two people face each other across a table, a disagreement may feel like a contest. When they walk in the same direction, the same disagreement can feel like a shared problem. Participants also report that it is easier to raise difficult subjects outdoors.',
        'Physical movement appears to help thinking as well. Research on creativity suggests that walking, even on a treadmill, can increase the number of ideas a person produces. The effect is modest but consistent, and it may explain why so many people report their best ideas arriving during a walk rather than at a desk.',
        'There are practical limits. Walking meetings work best for two or three people; larger groups become unwieldy on a pavement. They are unsuitable for reviewing documents or making detailed plans, since nobody can take notes easily. Weather matters too, and in some cities simply finding a quiet route is a challenge.',
        'Perhaps the strongest argument is cultural rather than physical. Holding a meeting while walking signals that the conversation is informal and exploratory rather than formal and decisive. That signal can change how people behave before anyone speaks. In a formal room, participants tend to present finished positions; on a walk, they are more likely to think aloud.',
        'For organizations willing to experiment, the cost of trying is close to zero. The main requirement is a manager who is comfortable giving up the authority that a head seat at a table provides.',
      ],
      questions: [
        {
          q: 'What is the main difference between a walking meeting and a traditional one?',
          options: [
            'It lasts much longer.',
            'Participants walk side by side instead of facing each other.',
            'It requires no preparation at all.',
            'It involves more than five people.',
          ],
          answer: 1,
          explain: '第一段："instead of sitting opposite each other, two or three people walk side by side"。核心差异是并排行走而非面对面。',
        },
        {
          q: 'Why might disagreement feel less threatening during a walk?',
          options: [
            'People are too tired to argue.',
            'The outdoor setting forbids conflict.',
            'Walking in the same direction makes it feel like a shared problem.',
            'Managers are absent from such meetings.',
          ],
          answer: 2,
          explain: '第二段："When they walk in the same direction, the same disagreement can feel like a shared problem."',
        },
        {
          q: 'What does the research on creativity suggest?',
          options: [
            'Walking can slightly increase the number of ideas produced.',
            'Only outdoor walking improves creativity.',
            'Creative people walk more often than others.',
            'Walking has no measurable effect on thinking.',
          ],
          answer: 0,
          explain: '第三段："walking, even on a treadmill, can increase the number of ideas a person produces. The effect is modest but consistent" —— 幅度不大但稳定，且跑步机上同样有效，排除 B。',
        },
        {
          q: 'Which is mentioned as a limitation of walking meetings?',
          options: [
            'They are expensive to organize.',
            'They cannot be held in winter.',
            'They are unsuitable for reviewing documents.',
            'They require professional training.',
          ],
          answer: 2,
          explain: '第四段："They are unsuitable for reviewing documents or making detailed plans, since nobody can take notes easily."',
        },
        {
          q: 'What does the author consider the strongest argument for walking meetings?',
          options: [
            'The health benefits of exercise.',
            'The signal it sends about the nature of the conversation.',
            'The money saved on meeting rooms.',
            'The chance to escape the office.',
          ],
          answer: 1,
          explain: '第五段开头："Perhaps the strongest argument is cultural rather than physical." 随后说明它传递"非正式、探索性"的信号。',
        },
      ],
    },

    {
      id: 'r-cet6-1',
      level: 'cet6',
      title: 'The Cost of Constant Interruption',
      passage: [
        'The modern office was designed around the assumption that workers can switch tasks at will. Open-plan layouts, instant messaging and constant notifications all reflect a belief that responsiveness is a virtue. A growing body of evidence suggests that this assumption is not merely optimistic but actively harmful.',
        'The central difficulty is what psychologists call attention residue. When a person leaves one task to answer a message and then returns, part of their mind remains occupied with the interruption. The residue is small for trivial matters but substantial when the interrupting task is emotionally engaging or unfinished. In practice, this means that a two-minute reply can cost far more than two minutes of productivity.',
        'The effects compound over a working day. Each switch imposes a cost, and the costs do not simply add up; they interact. Workers who are interrupted frequently report feeling busy while accomplishing less, a discrepancy that is difficult to detect from the outside because visible activity remains high.',
        'Some organizations have responded by experimenting with protected time. The approach varies: some designate mornings as meeting-free, others allow staff to set their messaging status to unavailable for blocks of several hours. Early reports are encouraging, though the evidence base remains thin and heavily reliant on self-reporting.',
        'A more fundamental question concerns measurement. If a company evaluates employees by responsiveness, it will get responsiveness, whatever else it claims to value. The incentive structure, rather than the physical environment, may be the real obstacle. Removing notifications from a screen changes little if a manager expects an answer within five minutes.',
        'None of this implies that communication should be reduced. It implies that communication should be batched, scheduled and, above all, expected at predictable times. The goal is not isolation but rhythm: periods of uninterrupted work alternating with periods of genuine availability.',
      ],
      questions: [
        {
          q: 'What does "attention residue" refer to in the second paragraph?',
          options: [
            'The tendency to forget tasks after finishing them.',
            'The part of the mind that stays occupied with an interruption.',
            'The physical tiredness caused by screen use.',
            'The memory loss associated with multitasking.',
          ],
          answer: 1,
          explain: '第二段定义："part of their mind remains occupied with the interruption"，即注意力残留。',
        },
        {
          q: 'Why is the cost of interruption described as compounding?',
          options: [
            'Because interruptions become longer over time.',
            'Because the costs interact rather than simply add up.',
            'Because workers gradually lose the ability to focus.',
            'Because managers increase demands when output falls.',
          ],
          answer: 1,
          explain: '第三段："the costs do not simply add up; they interact." 即成本相互叠加放大，而非线性相加。',
        },
        {
          q: 'What does the author say about the evidence for protected time?',
          options: [
            'It is overwhelming and conclusive.',
            'It is encouraging but limited and self-reported.',
            'It shows no measurable benefit.',
            'It comes entirely from employee surveys of failed trials.',
          ],
          answer: 1,
          explain: '第四段末："Early reports are encouraging, though the evidence base remains thin and heavily reliant on self-reporting."',
        },
        {
          q: 'According to the passage, what is the real obstacle to reducing interruption?',
          options: [
            'The design of office buildings.',
            'The lack of suitable software tools.',
            'The way employee performance is measured and rewarded.',
            'The unwillingness of employees to focus.',
          ],
          answer: 2,
          explain: '第五段："If a company evaluates employees by responsiveness, it will get responsiveness" 并指出 "The incentive structure... may be the real obstacle."',
        },
        {
          q: "What does the author recommend at the end of the passage?",
          options: [
            'Eliminating communication altogether.',
            'Scheduling communication into predictable periods.',
            'Returning to private offices for all staff.',
            'Allowing employees to choose their own working hours.',
          ],
          answer: 1,
          explain: '末段："communication should be batched, scheduled and, above all, expected at predictable times." 并强调目标是 "rhythm" 而非隔绝，排除 A。',
        },
      ],
    },

    {
      id: 'r-cet4-3',
      level: 'cet4',
      title: 'Why Libraries Still Matter',
      passage: [
        "The internet was expected to make libraries unnecessary. Every book, every fact and every answer, it was said, would soon be available from a phone. Two decades later, visits to public libraries in many countries have risen rather than fallen. The prediction was not simply wrong; it answered the wrong question.",
        "People do not go to libraries only to find information. A survey in one large city asked visitors why they had come. The most common answer was not books at all but 'a quiet place to work'. Borrowing books came second, free internet third, and asking a librarian for help fourth. What is scarce, in other words, is not information but space, attention and guidance.",
        "That distinction matters for how libraries are funded. A politician who believes a library is a warehouse of books will conclude that it has been replaced by a search engine. A politician who understands it as a piece of social infrastructure will notice what else it provides: warmth in winter, a desk for someone whose flat has no room for one, and a place where a person can sit for hours without being asked to buy anything.",
        "The guidance part is easy to undervalue. Search engines return results in order of popularity, not accuracy, and a confident answer is not the same as a correct one. Librarians are trained to help people judge a source rather than simply accept it. In an environment where false information travels faster than corrections, that skill is not a luxury.",
        "None of this means libraries should resist technology. The ones that thrive have generally embraced it, offering e-books, digital archives and computer access alongside the reading room. What they have not done is treat the screen as a replacement for the building. The building, it turns out, was never only about the books.",
      ],
      questions: [
        {
          q: 'What does the author say about the prediction that the internet would replace libraries?',
          options: [
            'It proved completely accurate.',
            'It considered the wrong problem rather than being entirely false.',
            'It was never seriously proposed by anyone.',
            'It applied only to university libraries.',
          ],
          answer: 1,
          explain: '第一段末："The prediction was not simply wrong; it answered the wrong question." 即预测并非全错，而是问错了问题。',
        },
        {
          q: 'According to the survey, what was the most common reason for visiting a library?',
          options: [
            'Borrowing printed books.',
            'Using free internet access.',
            'Finding a quiet place to work.',
            'Asking librarians for assistance.',
          ],
          answer: 2,
          explain: '第二段："The most common answer was not books at all but \'a quiet place to work\'." 借书第二、免费网络第三、求助馆员第四。',
        },
        {
          q: 'Why does the author say the distinction matters for funding?',
          options: [
            'Because libraries cost more to run than search engines.',
            'Because how a library is understood determines what it is funded to provide.',
            'Because politicians rarely visit libraries themselves.',
            'Because funding decisions are made by librarians.',
          ],
          answer: 1,
          explain: '第三段把两种认知对立起来：当成"书库"就会认为已被搜索引擎取代；当成"社会基础设施"才会看见取暖、书桌、可久坐的空间。理解方式直接决定拨款内容。',
        },
        {
          q: 'What point is made about search engines?',
          options: [
            'They rank results by accuracy.',
            'Their confident answers are always correct.',
            'They order results by popularity, which is not the same as accuracy.',
            'They have removed the need for trained staff.',
          ],
          answer: 2,
          explain: '第四段："Search engines return results in order of popularity, not accuracy, and a confident answer is not the same as a correct one."',
        },
        {
          q: "What is the author's attitude in the final paragraph?",
          options: [
            'Libraries should refuse digital technology.',
            'Digital services and physical space serve different purposes, so both are needed.',
            'The building matters more than what it contains.',
            'E-books will soon replace printed books entirely.',
          ],
          answer: 1,
          explain: '末段主张拥抱技术（电子书、数字档案、电脑），但不把屏幕当作建筑的替代品——两者各司其职，排除 A 与 C。',
        },
      ],
    },

    {
      id: 'r-cet4-4',
      level: 'cet4',
      title: 'The Trouble with Perfectionism',
      passage: [
        "Perfectionism is often treated as a virtue. Teachers praise students who refuse to accept second best; employers admire staff who check their work obsessively. Yet psychologists who study the trait have grown uneasy about this praise, because the word covers two very different things.",
        "The first is a high standard, held steadily. People with this pattern set ambitious goals, work towards them, and feel satisfied when they reach them. The second is a fear of mistakes that never resolves. People with this pattern also set high goals, but they experience every small error as evidence of personal failure. Research consistently finds that the first is associated with achievement, and the second with anxiety, exhaustion and, unexpectedly, lower output.",
        "The link with lower output is explained partly by procrastination. If a piece of work can never be good enough, beginning it becomes frightening. The student who cannot start an essay until the perfect opening arrives, and the employee who rewrites a report six times, are not lazy; they are trapped by a standard they cannot meet.",
        "There is also a social cost. Perfectionists tend to hide imperfect work, which means colleagues cannot see problems early, when they are cheap to fix. A team whose members each conceal their uncertainties is less effective than a team that surfaces them, even though the second group may look less impressive in the moment.",
        "The practical response is not to lower standards but to separate them from identity. A useful habit is to decide in advance what 'good enough' means for a given task, and then to deliver at that point rather than at the point of exhaustion. The aim is to be someone who does difficult work, not someone who never makes a mistake — a goal that is, by definition, impossible.",
      ],
      questions: [
        {
          q: 'What is the psychologists\' concern about the word "perfectionism"?',
          options: [
            'It is used too rarely in schools.',
            'It describes two different patterns that have opposite outcomes.',
            'It has no scientific meaning at all.',
            'It applies only to students.',
          ],
          answer: 1,
          explain: '第一、二段：这个词覆盖两种截然不同的模式——稳定的高标准（与成就相关）与对犯错的恐惧（与焦虑、疲惫、产出更低相关）。',
        },
        {
          q: 'What is the second pattern associated with, according to research?',
          options: [
            'Higher achievement and satisfaction.',
            'Anxiety, exhaustion and lower output.',
            'Better teamwork and faster decisions.',
            'Greater creativity under pressure.',
          ],
          answer: 1,
          explain: '第二段末："the second with anxiety, exhaustion and, unexpectedly, lower output."',
        },
        {
          q: 'Why does the second pattern lead to lower output?',
          options: [
            'Such people avoid difficult tasks entirely.',
            'Because work can never seem good enough, starting it becomes frightening.',
            'Because they spend too much time resting.',
            'Because they dislike working with colleagues.',
          ],
          answer: 1,
          explain: '第三段："If a piece of work can never be good enough, beginning it becomes frightening." 由此导致拖延。',
        },
        {
          q: 'What is the social cost of hiding imperfect work?',
          options: [
            'Colleagues see problems late, when fixing them is expensive.',
            'It improves the team\'s reputation.',
            'It speeds up delivery.',
            'It has no measurable effect.',
          ],
          answer: 0,
          explain: '第四段："colleagues cannot see problems early, when they are cheap to fix."',
        },
        {
          q: 'What does the author recommend?',
          options: [
            'Lowering one\'s standards considerably.',
            'Deciding what "good enough" means before starting a task.',
            'Avoiding feedback until the work is finished.',
            'Working longer hours to remove all errors.',
          ],
          answer: 1,
          explain: '末段："decide in advance what \'good enough\' means for a given task, and then to deliver at that point rather than at the point of exhaustion." 注意作者明确反对"降低标准"，排除 A。',
        },
      ],
    },

    {
      id: 'r-cet6-2',
      level: 'cet6',
      title: 'The Reputation Economy',
      passage: [
        "A restaurant with four and a half stars is not necessarily better than one with four. It may simply have been reviewed by different people on different evenings. Yet the number shapes decisions: diners choose by it, owners chase it, and platforms profit from it. Ratings have become a currency, and like any currency they are subject to inflation.",
        "The mechanics are predictable. When a score is displayed publicly, the people being scored learn to manage it. Sellers ask satisfied customers for reviews and discourage unhappy ones. Some go further, buying reviews or generating them automatically. Each behaviour is rational for the individual and corrosive for the system.",
        "Buyers are not passive either. Many have learned to discount extreme scores, reading instead for the content of complaints. A one-star review that describes slow service is informative; a one-star review that says only 'terrible' is not. Over time, users develop habits that make the aggregate number less useful than the platform intended.",
        "The deeper problem is that a single number compresses things that are not comparable. Cleanliness, price, waiting time and staff manner are different dimensions, and customers care about them in different proportions. Averaging them produces a figure that is precise, comparable and often misleading — the appearance of measurement rather than measurement itself.",
        "Some platforms now show distributions instead of averages, or weight reviews according to how much a reviewer has actually used the service. These are modest improvements, and they share a feature: they make the system harder to game by making it harder to summarise. That may be the real lesson. A metric becomes trustworthy not when it is simple, but when those being measured cannot easily improve the number without improving the thing it stands for.",
      ],
      questions: [
        {
          q: 'What does the first paragraph suggest about star ratings?',
          options: [
            'They measure quality with considerable precision.',
            'They are shaped by who happened to review, yet they drive decisions.',
            'They are ignored by most diners.',
            'They are regulated by law in most countries.',
          ],
          answer: 1,
          explain: '第一段先否定"精确代表质量"（4.5 星未必强于 4 星），再指出"the number shapes decisions"——受抽样影响却主导选择。',
        },
        {
          q: 'Why do sellers try to manage their scores?',
          options: [
            'Because the law requires accurate reviews.',
            'Because the score is displayed publicly and affects their income.',
            'Because platforms force them to do so.',
            'Because customers demand that they do.',
          ],
          answer: 1,
          explain: '第二段："When a score is displayed publicly, the people being scored learn to manage it." 加第一段"owners chase it"。',
        },
        {
          q: 'How have buyers adapted?',
          options: [
            'They trust extreme scores more than before.',
            'They read the content of complaints rather than relying on the number.',
            'They have stopped using platforms.',
            'They only visit highly rated places.',
          ],
          answer: 1,
          explain: '第三段："Many have learned to discount extreme scores, reading instead for the content of complaints."',
        },
        {
          q: 'According to the author, what is the deeper problem with a single score?',
          options: [
            'It is too difficult to calculate.',
            'It averages dimensions that are not comparable.',
            'It changes too frequently to be useful.',
            'It is hidden from users.',
          ],
          answer: 1,
          explain: '第四段："a single number compresses things that are not comparable" 并列举清洁度、价格、等待时间、服务态度等不同维度。',
        },
        {
          q: 'What is the main point of the final paragraph?',
          options: [
            'Simpler metrics are always more reliable.',
            'A metric is trustworthy when improving it requires improving what it measures.',
            'Platforms should remove ratings entirely.',
            'Distributions are impossible to manipulate.',
          ],
          answer: 1,
          explain: '末段："A metric becomes trustworthy not when it is simple, but when those being measured cannot easily improve the number without improving the thing it stands for."',
        },
      ],
    },

    {
      id: 'r-cet6-3',
      level: 'cet6',
      title: 'The Myth of the Solo Genius',
      passage: [
        "The history of science is usually told as a sequence of individuals. A name is attached to a theory, a portrait hangs in a corridor, and the impression is created that discovery is the work of a single extraordinary mind. Historians who examine the notebooks tend to reach a different conclusion: the names are memorable, but the work is almost always distributed.",
        "Consider the most cited papers in any field. Studies of authorship patterns find that the proportion written by a single author has fallen steadily for decades, and that the fall is steepest in the disciplines where progress is fastest. This is not merely because more people now work in research. It is because the problems that remain unsolved are too large for one specialist, and because the tools required are increasingly owned by different people.",
        "Collaboration brings its own costs. Coordination consumes time, credit is disputed, and groups are susceptible to a failure mode in which everyone defers to the most confident member. The last of these is the most dangerous, because it is invisible while it is happening: a group that agrees quickly feels efficient, and the absence of disagreement is easily mistaken for the absence of doubt.",
        "What seems to distinguish successful collaborations is not harmony but the presence of people willing to say that an idea is weak. Research on team performance repeatedly finds that the best predictor is not average intelligence but the distribution of speaking time. Teams in which a few members dominate produce fewer accurate judgments, even when those members are the most able.",
        "There is also a structural point about how credit is assigned. Prizes, promotions and funding are typically awarded to individuals, which creates an incentive to present shared work as personal. The effect is not trivial: it distorts the historical record, discourages the unglamorous contributions that make large projects possible, and encourages younger researchers to protect their ideas rather than develop them with others.",
        "None of this implies that individual talent is a fiction. Someone has to have the insight, and someone has to do the work of persuading the field. It implies only that the unit of discovery is usually a group, and that a culture which can only remember one name per discovery will systematically misdescribe how knowledge is made.",
      ],
      questions: [
        {
          q: 'What do historians examining notebooks tend to conclude?',
          options: [
            'That discoveries are usually the work of one exceptional mind.',
            'That the work behind a discovery is almost always distributed among people.',
            'That individual names are historically unimportant.',
            'That notebooks are unreliable sources.',
          ],
          answer: 1,
          explain: '第一段："the names are memorable, but the work is almost always distributed." 作者并未否定个人（末段也承认），只是指出工作分布。',
        },
        {
          q: 'Why has single-author work declined, according to the passage?',
          options: [
            'Because journals now prefer multiple authors.',
            'Because remaining problems are too large for one specialist and require different kinds of tools.',
            'Because funding agencies require collaboration.',
            'Because solo research is of lower quality.',
          ],
          answer: 1,
          explain: '第二段："the problems that remain unsolved are too large for one specialist, and because the tools required are increasingly owned by different people."',
        },
        {
          q: 'What is described as the most dangerous failure mode of groups?',
          options: [
            'Arguments that slow down decisions.',
            'Everyone deferring to the most confident member.',
            'Unequal distribution of funding.',
            'Frequent changes of membership.',
          ],
          answer: 1,
          explain: '第三段指出这一失效模式"the most dangerous, because it is invisible while it is happening"，即全员顺从最自信者。',
        },
        {
          q: 'What predicts team performance best, according to research?',
          options: [
            'The average intelligence of members.',
            'The presence of a dominant leader.',
            'How evenly speaking time is distributed.',
            'The seniority of the most experienced member.',
          ],
          answer: 2,
          explain: '第四段："the best predictor is not average intelligence but the distribution of speaking time." 发言时间分布越均衡越好。',
        },
        {
          q: 'What is the author\'s final position?',
          options: [
            'Individual talent does not exist.',
            'Individual insight matters, but the unit of discovery is usually a group.',
            'Prizes should be abolished entirely.',
            'Collaboration always produces better work than individual effort.',
          ],
          answer: 1,
          explain: '末段明确："None of this implies that individual talent is a fiction... It implies only that the unit of discovery is usually a group." 排除 A 与 D 的绝对化表述。',
        },
      ],
    },

    {
      id: 'r-cet6-4',
      level: 'cet6',
      title: 'The Limits of Transparency',
      passage: [
        "Transparency is one of those ideas that appear to require no argument. If an institution has nothing to hide, why should it object to being observed? The intuition is powerful, and it has produced a great deal of useful legislation. It has also produced a set of disappointments that are rarely discussed, because criticising transparency sounds like defending secrecy.",
        "The first difficulty is that transparency changes what is recorded. When every internal message may one day be published, officials write for the audience they imagine rather than for the colleague they are addressing. Advice becomes more cautious, and the candid reasoning that makes a decision understandable disappears from the record before the record exists. The published file is more complete and less informative at the same time.",
        "The second is volume. Releasing ten thousand documents satisfies the letter of a transparency requirement while defeating its purpose, since no citizen can read them. This is not always an accident. An institution that wishes to conceal a decision can often do so more effectively by burying it than by refusing to disclose it, and the resulting behaviour is difficult to distinguish from ordinary administrative untidiness.",
        "The third is that transparency measures activity rather than outcome. A published list of meetings, gifts and expenses tells us what was declared, not whether the decision was sound. Observers who lack the expertise to interpret the material may conclude either that everything is fine or that everything is corrupt, and both conclusions can be reached from the same documents.",
        "None of this argues for secrecy as a default. The case for disclosure is strong precisely because institutions have repeatedly used opacity to protect themselves. What it argues for is precision about what disclosure is for. If the aim is accountability, the useful questions are narrower: who decided, on what advice, and who bore the cost. Documents that answer those questions are worth more than a thousand pages that do not.",
        "The practical lesson is unglamorous. Transparency works best when it is designed backwards from the decision a citizen needs to check, rather than forwards from the filing cabinet that happens to exist. That requires editors, not merely publishers, and editing is expensive, unglamorous work that no one is praised for doing.",
      ],
      questions: [
        {
          q: 'Why is the disappointment with transparency rarely discussed?',
          options: [
            'Because the evidence is unavailable.',
            'Because criticising transparency sounds like defending secrecy.',
            'Because no legislation has been passed.',
            'Because officials refuse to comment.',
          ],
          answer: 1,
          explain: '第一段末："It has also produced a set of disappointments that are rarely discussed, because criticising transparency sounds like defending secrecy."',
        },
        {
          q: 'What is the first difficulty described?',
          options: [
            'Documents are frequently forged.',
            'The knowledge that everything may be published changes what gets written.',
            'Citizens are not interested in documents.',
            'Institutions refuse to publish anything at all.',
          ],
          answer: 1,
          explain: '第二段：官员会为想象中的读者写作，"the candid reasoning... disappears from the record before the record exists"，结果文件更完整却更少信息。',
        },
        {
          q: 'What does the passage say about releasing very large numbers of documents?',
          options: [
            'It always satisfies the purpose of transparency.',
            'It can defeat the purpose, and may be used deliberately to bury information.',
            'It is illegal in most jurisdictions.',
            'It reduces administrative costs.',
          ],
          answer: 1,
          explain: '第三段："Releasing ten thousand documents satisfies the letter... while defeating its purpose" 并指出掩盖"by burying it"比拒绝公开更有效。',
        },
        {
          q: 'What problem arises from measuring activity rather than outcome?',
          options: [
            'It costs too much to produce.',
            'It tells us what was declared, not whether the decision was sound.',
            'It reveals too much about individuals.',
            'It cannot be published online.',
          ],
          answer: 1,
          explain: '第四段："tells us what was declared, not whether the decision was sound"，并说明同一批文件可以支持相反结论。',
        },
        {
          q: 'What does the author recommend?',
          options: [
            'Treating secrecy as the default.',
            'Designing disclosure around the specific decisions citizens need to check.',
            'Publishing fewer documents without explanation.',
            'Leaving interpretation entirely to experts.',
          ],
          answer: 1,
          explain: '末两段："the useful questions are narrower: who decided, on what advice, and who bore the cost" 与 "designed backwards from the decision a citizen needs to check"。作者明确反对以保密为默认。',
        },
      ],
    },
  ],

  /* ─────────── 选词填空 ─────────── */
  cloze: [
    {
      id: 'c-cet4-1',
      level: 'cet4',
      title: 'Learning by Volunteering',
      passage:
        'Universities often encourage students to take part in community service, and many now give academic credit for it. Supporters argue that volunteering teaches skills which classrooms cannot easily __1__: patience, teamwork and the ability to communicate with people from very different backgrounds. Critics, however, warn that making service __2__ may turn a genuine contribution into a box to be ticked.\n\n' +
        'The evidence is mixed but not discouraging. Studies of student volunteers generally find that participants report greater confidence and stronger ties to their local community. The effects on academic performance are harder to __3__; some studies show small gains, others none at all. What seems clear is that the quality of the experience matters far more than the number of hours __4__.\n\n' +
        'A student who spends two hours a week tutoring children in a subject they love is likely to gain more than one who spends ten hours on an administrative task with no visible __5__. Organizations therefore need to think carefully about what they ask volunteers to do. Simply having people available is not the same as giving them something __6__.\n\n' +
        'There is also a question of __7__. Students from wealthier backgrounds can often afford to work without pay, while those who need to earn money may be __8__ from participating. If service is required for graduation, this difference becomes a matter of fairness rather than choice. Some universities have responded by offering paid placements or by counting relevant part-time work towards the requirement.\n\n' +
        'None of this means the idea should be abandoned. It means the design __9__. Volunteering, done well, gives students a rare chance to see the effect of their efforts on real people. Done badly, it teaches them that helping others is a __10__ to be completed as quickly as possible.',
      wordbank: [
        'academic', 'career', 'compulsory', 'consequence', 'demonstrate',
        'excluded', 'formal', 'genuinely', 'measure', 'meaningful',
        'obstacle', 'requirement', 'routine', 'substantial', 'task',
      ],
      answers: {
        1: 'demonstrate',
        2: 'compulsory',
        3: 'measure',
        4: 'requirement',
        5: 'consequence',
        6: 'meaningful',
        7: 'fairness',
        8: 'excluded',
        9: 'matters',
        10: 'task',
      },
      /* 说明：第 7 空答案为文中的 fairness，词库中没有时在渲染时自动补入 */
      extraBank: ['fairness', 'matters'],
      explains: {
        1: 'teaches skills which classrooms cannot easily ___ —— 课堂难以"展示/体现"这些技能，demonstrate 合适。',
        2: 'making service ___ 后文说"变成打勾的任务"，可见是把它设为"必修/强制"，选 compulsory。',
        3: 'effects on academic performance are harder to ___ —— 学业表现的影响更难以"衡量"，选 measure。',
        4: 'the number of hours ___ —— 指"要求"的学时数，requirement。',
        5: 'no visible ___ —— 没有可见的"结果/影响"，consequence。',
        6: 'giving them something ___ —— 给他们"有意义"的事做，meaningful。',
        7: 'a question of ___ —— 后文讲经济条件差异导致机会不均，属于"公平"问题，fairness。',
        8: 'may be ___ from participating —— 可能被"排除"在外，excluded。',
        9: 'It means the design ___ —— 设计本身"要紧/关键"，matters。',
        10: 'a ___ to be completed —— 被当成一项"任务"草草完成，task。',
      },
    },

    {
      id: 'c-cet6-1',
      level: 'cet6',
      title: 'The Value of Urban Green Space',
      passage:
        'City parks are frequently justified in economic terms. Planners point to rising property values near green areas, to tourism, and to the reduced cost of managing rainwater when soil absorbs it rather than drains __1__ into overloaded pipes. These arguments are persuasive, and they have helped secure budgets that would otherwise have been __2__.\n\n' +
        'Yet the case for green space rests on something less __3__ than money. Access to vegetation and open air has measurable effects on mental health. Studies consistently find that residents living within a short walk of a park report lower stress and better sleep. The effect is strongest among people with the fewest __4__ to leave the city at weekends.\n\n' +
        'This raises a question about how parks are designed. A large, well-maintained park in a wealthy district may do little for the people who most need it. What matters is __5__: whether a park can be reached on foot in ten minutes, whether the route feels safe, and whether entering it costs nothing. A small square surrounded by benches can be more __6__ than a famous garden behind a gate.\n\n' +
        'There is also the question of who actually uses these spaces. Surveys in several cities show that parks are used __7__ by men, and that women often report feeling unwelcome after dark. Playgrounds attract families with young children but may __8__ teenagers, who then gather in places where their presence is treated as a problem.\n\n' +
        'None of these difficulties is unusual, and none is __9__. They simply require that design decisions be made with the least powerful users in mind rather than the most __10__ ones. A park that works for a lone elderly resident in the evening will almost certainly work for everyone else.',
      wordbank: [
        'accessible', 'afford', 'disproportionately', 'insoluble', 'intangible',
        'invaluable', 'opportunities', 'options', 'promptly', 'rejected',
        'resources', 'tangible', 'unequally', 'vocal', 'welcome',
      ],
      answers: {
        1: 'promptly',
        2: 'rejected',
        3: 'tangible',
        4: 'opportunities',
        5: 'accessibility',
        6: 'invaluable',
        7: 'disproportionately',
        8: 'exclude',
        9: 'insoluble',
        10: 'vocal',
      },
      extraBank: ['accessibility', 'exclude'],
      explains: {
        1: 'drains ___ into overloaded pipes —— 雨水"迅速"排入超载管道，promptly。',
        2: 'budgets that would otherwise have been ___ —— 否则会被"否决/砍掉"的预算，rejected。',
        3: 'something less ___ than money —— 比金钱更"无形"的东西，intangible。',
        4: 'the fewest ___ to leave the city —— 缺少"机会"离开城市的人，opportunities。',
        5: 'What matters is ___ —— 关键在于"可达性"，accessibility。',
        6: 'can be more ___ than a famous garden —— 小广场可能比名园更"宝贵"，invaluable。',
        7: 'parks are used ___ by men —— 男性使用比例"不成比例地"高，disproportionately。',
        8: 'may ___ teenagers —— 可能把青少年"排除"在外，exclude。',
        9: 'none is ___ —— 没有一个是"无法解决"的，insoluble。',
        10: 'rather than the most ___ ones —— 相对于"声音最大/最有话语权"的人，vocal。',
      },
    },

    {
      id: 'c-cet4-2',
      level: 'cet4',
      title: 'Learning a Language as an Adult',
      passage:
        'Many adults believe that language learning belongs to childhood, and that anyone who begins after twenty has already __1__ the chance. The evidence is more encouraging than this belief suggests. Adults generally learn grammar and vocabulary faster than children in the early stages; what children do better is acquire pronunciation and speak without __2__.\n\n' +
        'The difference seems to lie in how the two groups practise. Children are __3__ to hours of input, most of it simple and repetitive, and they are not embarrassed by mistakes. Adults, by contrast, often study for short periods and __4__ on grammar rules, avoiding conversation until they feel ready — which may be never.\n\n' +
        'A second factor is __5__. Adults who need the language for work or travel make faster progress than those who study without a clear purpose, because they are forced to use what they know in situations that __6__.\n\n' +
        'None of this means that age does not matter. Pronunciation, in particular, is __7__ to perfect later, and most learners retain an accent. But an accent is not a failure; it is evidence that someone learned a second language, which is more than most people __8__.\n\n' +
        'The practical advice that follows is simple. Spend more time listening than studying rules. Speak before you feel ready. Accept that mistakes are part of the process rather than a sign that you __9__ the ability. And measure progress over months rather than days, because the improvements that matter are usually __10__ at the moment they happen.',
      wordbank: [
        'achieve', 'confident', 'difficult', 'effort', 'exposed',
        'focus', 'grammar', 'hesitation', 'invisible', 'lack',
        'matter', 'missed', 'motivation', 'obvious', 'reward',
      ],
      answers: {
        1: 'missed',
        2: 'hesitation',
        3: 'exposed',
        4: 'focus',
        5: 'motivation',
        6: 'matter',
        7: 'difficult',
        8: 'achieve',
        9: 'lack',
        10: 'invisible',
      },
      explains: {
        1: 'has already ___ the chance —— 已经"错过"机会，missed。',
        2: 'speak without ___ —— 没有"犹豫"地开口，hesitation。',
        3: 'Children are ___ to hours of input —— 儿童"接触"大量输入，exposed to。',
        4: 'often study for short periods and ___ on grammar —— "专注"于语法规则，focus on。',
        5: 'A second factor is ___ —— 后文讲有无明确用途，即"动机"，motivation。',
        6: 'situations that ___ —— 真正"要紧/有意义"的场合，matter。',
        7: 'Pronunciation is ___ to perfect later —— 后期很难练到完美，difficult。',
        8: 'more than most people ___ —— 超过大多数人"能做到"的，achieve。',
        9: 'a sign that you ___ the ability —— 暗示你"缺乏"能力，lack。',
        10: 'usually ___ at the moment they happen —— 进步在发生时往往"看不见"，invisible。',
      },
    },

    {
      id: 'c-cet6-2',
      level: 'cet6',
      title: 'The Return of Repair Culture',
      passage:
        'For most of the twentieth century, repair was ordinary. Shoes were resoled, radios were mended, and a broken appliance was taken to a shop rather than __1__. That changed for reasons which had little to do with craftsmanship. Manufacturing became cheaper, products became harder to open, and replacement became __2__ than repair.\n\n' +
        'The environmental cost of this shift is now widely __3__. Electronic waste is the fastest growing category of household waste, and much of it is still functional. A device discarded because a battery has failed contains metals that were __4__ to extract from the ground in the first place.\n\n' +
        'A small counter-movement has appeared in response. Repair cafes, where volunteers help people fix their own possessions, have spread across Europe. Their purpose is partly practical and partly __5__: they exist to demonstrate that objects need not be __6__.\n\n' +
        'The obstacles are not only technical. Manufacturers often refuse to supply spare parts, and software locks can make an otherwise repairable device __7__. Legislation in several jurisdictions now requires that parts and manuals remain available for a number of years, but enforcement is __8__.\n\n' +
        'Supporters argue that the deepest change required is cultural. A society that treats objects as __9__ will keep producing waste, whatever the regulations say. Learning to repair something changes the way its owner sees it: from a product consumed to an object __10__.',
      wordbank: [
        'acknowledged', 'cheaper', 'disposable', 'discarded', 'expensive',
        'invisible', 'maintained', 'permanent', 'political', 'profitable',
        'repaired', 'temporary', 'uneven', 'urgent', 'useless',
      ],
      answers: {
        1: 'discarded',
        2: 'cheaper',
        3: 'acknowledged',
        4: 'expensive',
        5: 'political',
        6: 'disposable',
        7: 'useless',
        8: 'uneven',
        9: 'temporary',
        10: 'maintained',
      },
      explains: {
        1: 'taken to a shop rather than ___ —— 送去修理而不是"扔掉"，discarded。',
        2: 'replacement became ___ than repair —— 替换比修理"更便宜"，cheaper。',
        3: 'is now widely ___ —— 这一环境代价如今被广泛"承认"，acknowledged。',
        4: 'metals that were ___ to extract —— 当初开采这些金属"代价高昂"，expensive。',
        5: 'partly practical and partly ___ —— 与 practical 对举，指"政治性"的，political。',
        6: 'objects need not be ___ —— 物品不必是"用完即弃"的，disposable。',
        7: 'make a repairable device ___ —— 软件锁让本可修的设备变得"没用"，useless。',
        8: 'enforcement is ___ —— 执法"参差不齐"，uneven。',
        9: 'treats objects as ___ —— 把物品视为"临时的"，temporary。',
        10: 'an object ___ —— 与 consumed 对举，指被"维护保养"的物件，maintained。',
      },
    },
  ],

  /* ─────────── 长篇阅读匹配 ─────────── */
  matching: [
    {
      id: 'm-cet4-1',
      level: 'cet4',
      title: 'The Four-Day Week Experiment',
      paragraphs: [
        { label: 'A', text: 'When a small British research firm announced in 2022 that it would test a four-day week at full pay, the reaction was sceptical. Customers worried about slower service; some employees privately expected to be asked to do five days of work in four. Eighteen months later the company reported that revenue had risen and that no employee had chosen to return to five days.' },
        { label: 'B', text: 'The experiment was part of a larger trial involving dozens of companies in several countries. Participating firms were not required to follow a single model. Some gave all staff a fixed day off; others let teams choose. What they shared was a commitment to keep pay unchanged and to measure output rather than hours.' },
        { label: 'C', text: 'The most common immediate effect was a sharp reduction in meetings. Teams discovered that many regular gatherings existed mainly to report progress that could be written down. Shortening or cancelling them recovered several hours a week without any obvious loss.' },
        { label: 'D', text: 'Employees also reported changes in how they worked. With less time available, people were more likely to protect blocks of concentration and less likely to begin tasks they could not finish. Several managers noted that the quality of written communication improved, because decisions now had to be recorded rather than remembered.' },
        { label: 'E', text: 'Not every part of the trial went smoothly. Companies serving customers seven days a week struggled to cover the fifth day without hiring. In a few cases, staff on fixed shifts felt that the arrangement favoured office workers. These complaints were most serious where the reduction was applied uniformly rather than designed around the actual work.' },
        { label: 'F', text: 'Recruitment was one area where the benefit was unexpectedly clear. Several firms reported that job advertisements mentioning a four-day week attracted far more applicants, and that offers were accepted more quickly. For smaller companies unable to compete on salary, this was described as a significant advantage.' },
        { label: 'G', text: 'Sceptics point out that the companies taking part were volunteers, and that firms willing to try such a scheme may already be well organized. The results, they argue, may say more about the participants than about the model. Supporters accept this criticism but note that the same objection applies to almost every workplace reform.' },
        { label: 'H', text: 'What the trial did establish is that the five-day week is a convention rather than a law of nature. It was standardized in the twentieth century for reasons that had as much to do with factory scheduling as with productivity. Whether it survives the twenty-first may depend less on evidence than on habit.' },
      ],
      statements: [
        { text: 'Some companies found the shorter week helped them attract job applicants.', answer: 'F' },
        { text: 'The original company saw its income increase after the change.', answer: 'A' },
        { text: 'Meetings were often cancelled because their information could be written down instead.', answer: 'C' },
        { text: 'Businesses open every day of the week had difficulty covering the extra day off.', answer: 'E' },
        { text: 'Employees became more careful about starting work they might not complete.', answer: 'D' },
        { text: 'Critics argue that participating firms were not typical.', answer: 'G' },
        { text: 'The five-day week was established for reasons partly related to factory organization.', answer: 'H' },
        { text: 'Firms in the trial were free to choose different ways of arranging the shorter week.', answer: 'B' },
        { text: 'Written communication became clearer because decisions had to be recorded.', answer: 'D' },
        { text: 'Some staff on fixed schedules felt the scheme was unfair to them.', answer: 'E' },
      ],
    },

    {
      id: 'm-cet6-1',
      level: 'cet6',
      title: 'Artificial Intelligence and the Shape of Work',
      paragraphs: [
        { label: 'A', text: 'Predictions about technology and employment have a poor record. In the 1930s economists forecast mass unemployment within a generation; in the 1990s, the spread of personal computers was expected to eliminate clerical work entirely. In both cases the number of jobs fell in specific categories while rising overall. The lesson is not that predictions are always wrong, but that they consistently misjudge which tasks will be automated and which will expand.' },
        { label: 'B', text: 'The current wave of systems differs from earlier automation in one important respect. Previous machines replaced physical or repetitive work with clearly defined rules. The new tools perform tasks that were thought to require judgement: summarizing documents, drafting routine correspondence, producing plausible images. The boundary between what can and cannot be delegated has moved, and it has moved quickly.' },
        { label: 'C', text: 'Early evidence from workplaces suggests that the effect is uneven within occupations rather than between them. A law firm may not need fewer lawyers, but it may need fewer junior lawyers doing document review, and more senior lawyers able to supervise the output of a system they did not write. The same pattern appears in medicine, journalism and software development.' },
        { label: 'D', text: 'This creates a difficult problem for anyone starting a career. Traditional professions have relied on a ladder in which routine tasks are performed by newcomers while they acquire judgement. If the routine tasks disappear, the first rung disappears with them. Some firms have begun to invent substitutes, assigning juniors to verify and correct machine output, but it is unclear whether such work builds the same understanding.' },
        { label: 'E', text: 'There is also a question of accountability. A system can produce a confident and completely incorrect answer. Responsibility, however, cannot be delegated to software. Organizations that adopt these tools quickly are discovering that they must invest heavily in checking, and that the cost of checking rises sharply as the volume of generated material increases.' },
        { label: 'F', text: 'Public discussion tends to focus on whether machines will replace people. A more practical question is how the gains will be distributed. If a tool allows one person to do the work previously done by three, the outcome depends entirely on decisions made by institutions: whether the saved time becomes shorter hours, higher output, or simply fewer staff.' },
        { label: 'G', text: 'Historically, productivity gains have often been followed by shorter working hours and new categories of employment that nobody had anticipated. Whether that pattern repeats is not guaranteed. It depended in the past on workers being able to bargain collectively and on public investment in education that matched the new demand for skills.' },
        { label: 'H', text: 'None of this suggests that individuals should attempt to predict the future. It suggests that the useful skills are those which remain valuable when specific tools change: the ability to judge whether an answer is plausible, to explain a decision to someone who disagrees, and to recognize when a problem has been stated in the wrong terms.' },
      ],
      statements: [
        { text: 'Earlier predictions about technology and jobs were often inaccurate.', answer: 'A' },
        { text: 'The new systems can carry out work that was previously believed to need judgement.', answer: 'B' },
        { text: 'The impact is felt differently at different levels within the same profession.', answer: 'C' },
        { text: 'Newcomers may lose the routine work through which they used to learn.', answer: 'D' },
        { text: 'Checking machine output becomes more expensive as more material is produced.', answer: 'E' },
        { text: 'Whether benefits become shorter hours or fewer staff depends on institutional choices.', answer: 'F' },
        { text: 'Past gains in productivity relied partly on collective bargaining and public education.', answer: 'G' },
        { text: 'People should focus on abilities that survive changes in tools.', answer: 'H' },
        { text: 'Some firms have created new tasks for junior staff to compensate for lost training.', answer: 'D' },
        { text: 'Responsibility for errors cannot be transferred to software.', answer: 'E' },
      ],
    },

    {
      id: 'm-cet4-2',
      level: 'cet4',
      title: 'The Remote Work Settlement',
      paragraphs: [
        { label: 'A', text: 'Before 2020 remote work was a marginal arrangement, granted to a few employees and regarded by many managers as a favour. When offices closed, the practice stopped being optional. Millions of people who had never worked from home were given a laptop and a video link within a week. Almost nobody had planned it, and almost everybody discovered afterwards that some of it worked better than expected.' },
        { label: 'B', text: 'The evidence on productivity is mixed, but the pattern is fairly consistent. For routine tasks with clear outputs, output has generally held steady or risen slightly, largely because commuting time was reclaimed. For work that depends on rapid exchange of half-formed ideas, the picture is less favourable, and several firms report that certain kinds of collaboration have become slower.' },
        { label: 'C', text: 'Property has proved the least flexible part of the system. Firms that signed long leases before the change now pay for space they rarely fill. Some have sublet floors; others have redesigned offices around meetings rather than desks. Either way, the decision is expensive and slow, which is one reason the office has not disappeared as quickly as some predicted.' },
        { label: 'D', text: 'The cost to new employees is harder to measure and easier to overlook. Much of what a junior member of staff learns used to be absorbed by sitting near experienced colleagues and overhearing how problems were handled. That channel closes when everyone works in separate rooms. Some organisations have responded by scheduling formal mentoring sessions, but a scheduled conversation is not the same as an accidental one.' },
        { label: 'E', text: 'Managers report a related difficulty: judging performance when presence can no longer be observed. Many have shifted towards measuring outputs and deadlines, which sounds more objective but can penalise work whose value appears only slowly. Others have simply increased the frequency of reporting, which replaces one form of surveillance with another.' },
        { label: 'F', text: 'Employees, meanwhile, are ambivalent. Surveys consistently show a strong preference for at least some remote work, mainly because of the time and money saved. The same surveys record difficulty in switching off, and a sense that the working day has expanded to fill the space the commute used to occupy.' },
        { label: 'G', text: 'Cities feel the change unevenly. Businesses that depended on office workers — sandwich shops, dry cleaners, gyms — lost a predictable daily clientele, while residential neighbourhoods gained one. Public transport revenue fell sharply in many places, with consequences that outlast the immediate crisis.' },
        { label: 'H', text: 'What seems to be emerging is not a universal rule but a set of local settlements. Different firms, and even different teams within one firm, are arriving at different answers according to the work they do. The likely outcome is that remote work becomes a negotiated condition of employment rather than a fixed company policy, decided case by case and revised as evidence accumulates.' },
      ],
      statements: [
        { text: 'Remote work used to be rare and was granted as a favour.', answer: 'A' },
        { text: 'The change happened quickly and with very little planning.', answer: 'A' },
        { text: 'For routine tasks, output has generally not fallen.', answer: 'B' },
        { text: 'Work needing rapid exchange of unfinished ideas has suffered more.', answer: 'B' },
        { text: 'Some firms pay for office space they no longer need.', answer: 'C' },
        { text: 'New staff used to learn by overhearing how colleagues handled problems.', answer: 'D' },
        { text: 'Scheduled mentoring is not equivalent to accidental learning.', answer: 'D' },
        { text: 'Some managers now judge results rather than visible presence.', answer: 'E' },
        { text: 'Shops and services in business districts lost regular customers.', answer: 'G' },
        { text: 'Arrangements are likely to be decided individually rather than by one company rule.', answer: 'H' },
      ],
    },

    {
      id: 'm-cet6-2',
      level: 'cet6',
      title: 'Measuring What Matters',
      paragraphs: [
        { label: 'A', text: 'The complaint that gross domestic product measures output rather than welfare is not new. It was made within a decade of the statistic being invented, and it has been repeated by economists of every political persuasion since. What is new is that the criticism has begun to affect policy rather than merely decorate academic papers.' },
        { label: 'B', text: 'The most direct alternative is to ask people how they feel. National surveys now collect reports of life satisfaction, and some governments publish the results alongside growth figures. The appeal is obvious: the measure reflects what people themselves value rather than what officials assume they value.' },
        { label: 'C', text: 'Self-reported measures bring their own difficulties. People adapt to changed circumstances and then report their satisfaction relative to the new baseline, so a deterioration may show up only briefly. Cultures also differ in how they use rating scales: respondents in some countries avoid the top of the scale almost entirely, which makes international comparison treacherous.' },
        { label: 'D', text: 'A second family of indicators avoids asking people at all. Health expectancy, literacy, air quality and access to green space can be measured more or less objectively. These are attractive precisely because they are hard to manipulate, but they embed assumptions too: someone had to decide that air quality matters more than, say, noise.' },
        { label: 'E', text: 'Composite indices attempt to combine everything into one figure. Their weakness is arithmetic that conceals judgement. Weights that determine how much a point of health is worth relative to a point of income are not discovered in data; they are chosen. Presenting the result to two decimal places lends it a precision that the underlying values do not possess.' },
        { label: 'F', text: 'Nevertheless some governments have adopted wellbeing frameworks in earnest. National budgets in a few countries are now assessed against wellbeing objectives, and a handful have appointed officials responsible for them. These experiments remain small and contested, and it is not yet clear whether they change decisions or merely describe them.' },
        { label: 'G', text: 'There is also a warning from the history of measurement. When a statistic becomes a target, behaviour adapts to the statistic rather than to the thing it was meant to represent. Hospitals that are judged by waiting times shorten waiting times; schools judged by test scores raise test scores. Any wellbeing indicator adopted for policy will face the same pressure.' },
        { label: 'H', text: 'The most defensible conclusion is therefore modest. No single number should replace output as the definition of success; a small dashboard of indicators, published together and read together, is more honest than a composite because it forces trade-offs into the open. Deciding that one place has more health and less income than another is a political argument, and it should look like one.' },
      ],
      statements: [
        { text: 'Criticism of GDP as a welfare measure appeared soon after the statistic was created.', answer: 'A' },
        { text: 'People adjust to new circumstances, which can hide a decline in reported satisfaction.', answer: 'C' },
        { text: 'Different countries use rating scales in systematically different ways.', answer: 'C' },
        { text: 'Choosing the weights in a composite index involves value judgements.', answer: 'E' },
        { text: 'A few governments now assess budgets against wellbeing objectives.', answer: 'F' },
        { text: 'Such experiments are still limited and disputed.', answer: 'F' },
        { text: 'When a measure becomes a target, people adapt to the measure.', answer: 'G' },
        { text: 'Health expectancy and air quality are examples of objective indicators.', answer: 'D' },
        { text: 'The author recommends several indicators published together rather than one figure.', answer: 'H' },
        { text: 'Trade-offs between indicators should be visible rather than hidden in a formula.', answer: 'H' },
      ],
    },
  ],
};

/* 补齐词库中缺失的候选词，保证每个空都能从备选里找到 */
(function supplementBank() {
  QUIZ.cloze.forEach(set => {
    (set.extraBank || []).forEach(w => {
      if (!set.wordbank.includes(w)) set.wordbank.push(w);
    });
    set.wordbank = Array.from(new Set(set.wordbank));
  });
})();
