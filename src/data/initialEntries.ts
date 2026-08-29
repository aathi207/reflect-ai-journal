import { JournalEntry } from '../types';

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // Yesterday evening
    title: 'The Presentation Aftermath & The Fear of Not Being Enough',
    content: `Today was the quarterly architecture review with executive leadership. I spent the entire previous week obsessing over slide formatting, edge cases, and anticipating every possible counter-argument. 

When my turn came, the presentation itself went fine—leadership even nodded and approved the roadmap. But the moment I sat down, my brain fixated on a 15-second stumble on slide 4 where I briefly lost my train of thought. I convinced myself that everyone in that boardroom saw through me, that they secretly think I was unprepared, and that my entire credibility is now in question.

I canceled my evening walk with Sarah because I felt too mentally drained and embarrassed to be around anyone. It feels like no matter how much effort I put in, one minor imperfection completely invalidates everything I achieved. I just want to feel like my baseline effort is enough without this constant fear of exposure.`,
    rawMood: 'Anxious & Self-Critical',
    energyLevel: 2,
    tags: ['Career', 'Imposter Syndrome', 'Leadership', 'Vulnerability'],
    wordCount: 154,
    isFavorite: true,
    analysis: {
      dominantEmotion: {
        name: 'Vulnerable Hyper-Vigilance',
        category: 'Anxiety',
        intensity: 8,
        underlyingNeed: 'Need for unconditional self-worth and safety from perceived judgment',
        color: '#f59e0b'
      },
      executiveSynthesis: 'Despite receiving formal approval on a major strategic presentation, your focus immediately contracted onto a fleeting minor stumble. This cognitive distortion triggered profound self-judgment and social withdrawal, masking the substantial achievement you accomplished.',
      recurringThemes: [
        {
          theme: 'Perfectionism as an Armor',
          description: 'Using relentless preparation to prevent vulnerability and defend against perceived judgment.',
          category: 'Mindset',
          impact: 'tension'
        },
        {
          theme: 'Disqualifying Competence',
          description: 'Filtering out concrete executive approval while amplifying a transient 15-second pause.',
          category: 'Self-Worth',
          impact: 'tension'
        },
        {
          theme: 'Social Withdrawal Post-Stress',
          description: 'Canceling connection with loved ones as an instinctual response to shame and exhaustion.',
          category: 'Relationships',
          impact: 'tension'
        },
        {
          theme: 'Professional Growth & Visibility',
          description: 'Successfully presenting high-level roadmaps to executive leadership.',
          category: 'Career & Ambition',
          impact: 'positive'
        }
      ],
      cognitiveReframing: {
        detectedDistortion: 'Mental Filtering & Catastrophizing',
        originalThoughtPattern: 'Because I stumbled for 15 seconds on slide 4, the entire leadership team thinks I am incompetent and my credibility is ruined.',
        reframedPerspective: 'Human communication includes pauses; true authority is demonstrated by composure during unexpected friction. Leadership approved your roadmap because the substance of your thinking was sound. A brief stumble is evidence of human speech, not professional deficiency.',
        behavioralMicroStep: 'Send Sarah a short text: "Feeling a bit depleted after a big day, but I would love to grab a quiet 10-minute tea or walk with you tomorrow."'
      },
      tomorrowReflectionPrompt: 'When you notice your mind zooming in on a single imperfection tomorrow, what would you say to a colleague you admire if they made that exact same stumble?',
      empathyNote: 'Your dedication to high craftsmanship is admirable, but you deserve to celebrate your hard-won victories rather than penalizing yourself for being human.',
      growthScore: 88,
      analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString()
    }
  },
  {
    id: 'entry-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    title: 'Morning Silence, Fresh Coffee, and Setting a Rare Boundary',
    content: `Woke up at 6:30 AM before the neighborhood began buzzing. Made pour-over coffee and sat on the balcony without checking Slack or my inbox for the first full hour. 

During our team standup, a senior colleague tried to pass off an urgent unplanned report that would have ruined my weekend. In the past, I would have said 'Sure, no problem!' and silently seethed with resentment. Today, my heart raced, but I calmly replied: 'My bandwidth is committed to our core sprint deliverables this week; I can review this next Tuesday if it remains a priority.'

He simply replied: 'Understood, let's look at it Tuesday.' 

I couldn't believe how straightforward it was. No drama, no blowback. I felt a surge of grounded confidence that lasted all afternoon. I ended the day by cooking a warm lentil soup and reading two chapters of a novel.`,
    rawMood: 'Peaceful & Empowered',
    energyLevel: 4,
    tags: ['Boundaries', 'Peace', 'Work-Life Balance', 'Self-Advocacy'],
    wordCount: 158,
    isFavorite: true,
    analysis: {
      dominantEmotion: {
        name: 'Grounded Self-Efficacy',
        category: 'Resolve',
        intensity: 8,
        underlyingNeed: 'Autonomy, self-respect, and protected personal space',
        color: '#0d9488'
      },
      executiveSynthesis: 'By consciously cultivating morning stillness and asserting a firm, professional boundary during standup, you successfully protected your personal energy. The neutral reception from your colleague proved that boundaries can be stated without catastrophic conflict.',
      recurringThemes: [
        {
          theme: 'Boundary Assertion & Self-Advocacy',
          description: 'Replacing reflexive people-pleasing with calm, direct capacity limits.',
          category: 'Relationships',
          impact: 'positive'
        },
        {
          theme: 'Morning Stillness & Digital Hygiene',
          description: 'Creating protected mental space before digital inputs flood conscious attention.',
          category: 'Health & Energy',
          impact: 'positive'
        },
        {
          theme: 'Anticipated vs Realized Conflict',
          description: 'Experiencing how feared negative reactions frequently dissolve in practical communication.',
          category: 'Mindset',
          impact: 'positive'
        }
      ],
      cognitiveReframing: {
        detectedDistortion: 'Catastrophizing & People-Pleasing Bias',
        originalThoughtPattern: 'If I say no to an urgent request, others will resent me or judge my team commitment.',
        reframedPerspective: 'Clear boundaries are an act of mutual respect; they set transparent expectations and preserve the quality of the work you actually deliver.',
        behavioralMicroStep: 'Write down this sentence on a sticky note: "Saying no to non-essential demands is saying yes to my mental equilibrium."'
      },
      tomorrowReflectionPrompt: 'In what other area of your daily routine are you carrying responsibilities that do not belong to you?',
      empathyNote: 'Notice how liberating it feels when your actions align with your internal values. This is self-trust in action.',
      growthScore: 94,
      analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString()
    }
  },
  {
    id: 'entry-3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    title: 'The Resistance against Starting the Creative Project',
    content: `Spent three hours staring at a blank design document for the personal community app I've dreamed of building for two years. 

Every time I typed a paragraph, a voice whispered: 'Someone else has already built this better. Why are you wasting time? You have no real audience.' I rearranged my desk twice, washed three coffee mugs, reorganized my bookmarks, and ended up scrolling social media feeling hollow and frustrated with my lack of discipline.

I know deep down it is not laziness—it's pure terror that putting my creative self into the world will prove I don't have what it takes. I went to bed feeling disconnected from my purpose.`,
    rawMood: 'Frustrated & Blocked',
    energyLevel: 2,
    tags: ['Creativity', 'Fear of Failure', 'Procrastination', 'Purpose'],
    wordCount: 133,
    analysis: {
      dominantEmotion: {
        name: 'Creative Vulnerability Avoidance',
        category: 'Overwhelm',
        intensity: 7,
        underlyingNeed: 'Safe creative expression detached from outcome validation',
        color: '#6366f1'
      },
      executiveSynthesis: 'Your procrastination was not a failure of will, but a protective psychological mechanism against the vulnerability of creative exposure. Acknowledging that fear of judgment precedes creative flow is the bridge to unlocking momentum.',
      recurringThemes: [
        {
          theme: 'Creative Vulnerability & Resistance',
          description: 'Procrastination acting as a shield to protect self-esteem from potential failure.',
          category: 'Creativity',
          impact: 'tension'
        },
        {
          theme: 'Comparative Inadequacy',
          description: 'Measuring early raw ideas against polished, mature external products.',
          category: 'Mindset',
          impact: 'tension'
        },
        {
          theme: 'Desire for Purposeful Expression',
          description: 'A deep, enduring longing to create meaningful tools for others.',
          category: 'Self-Worth',
          impact: 'positive'
        }
      ],
      cognitiveReframing: {
        detectedDistortion: 'All-or-Nothing Comparison & Emotional Reasoning',
        originalThoughtPattern: 'If it cannot be revolutionary from day one, starting is pointless and reveals my inadequacy.',
        reframedPerspective: 'First drafts are supposed to be messy and exploratory. Your unique perspective is what gives the project life, and the goal of creating is personal evolution, not immediate perfection.',
        behavioralMicroStep: 'Commit to "The 5-Minute Terrible Draft"—open the document tomorrow and write 5 intentionally unpolished, messy sentences without editing.'
      },
      tomorrowReflectionPrompt: 'What would you build if you had a 100% guarantee that no one would judge you for the initial draft?',
      empathyNote: 'The fact that resistance feels so intense is proof of how deeply this project matters to your soul. Give yourself permission to make something imperfect.',
      growthScore: 82,
      analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString()
    }
  }
];

export const GUIDED_PROMPTS = [
  {
    category: 'Emotional Unpacking',
    prompt: 'What was the single moment today that demanded the most emotional energy from you, and why?',
    icon: 'HeartPulse'
  },
  {
    category: 'Cognitive Awareness',
    prompt: 'What unhelpful story did your mind tell you today, and what is an objective, compassionate reframe?',
    icon: 'Brain'
  },
  {
    category: 'Boundaries & Energy',
    prompt: 'Where did you give away your energy today out of obligation rather than genuine alignment?',
    icon: 'Shield'
  },
  {
    category: 'Gratitude & Savoring',
    prompt: 'What subtle, quiet moment brought unexpected warmth or calm to your day?',
    icon: 'Sun'
  },
  {
    category: 'Courage & Growth',
    prompt: 'What difficult truth did you acknowledge today that your past self would have avoided?',
    icon: 'Sparkles'
  }
];
