export type Vibe = {
  id: string
  label: string
  emoji: string
  note: string
  reaction?: string
}

export const invitationConfig = {
  recipientName: 'my favorite person',
  senderName: 'your secret admirer',
  subject: 'a tiny plan for us',
  question: 'Will you go on a date with me?',
  finalMessage: 'glad you didn\'t say no. be ready, I\'m coming to get you',
  // playful NO button messages (used when it escapes)
  noButtonMessages: [
    'nope 😭',
    'too slow',
    'nice try',
    'not happening',
    'try again 😂',
    'almost!',
    'you missed 😭',
    'catch me!',
    'no ❤️',
    'wrong button',
    'hehe',
    'are you sure?',
    'you really tried 😭',
    'NO ESCAPE',
    'you can\'t catch me'
  ],
  // micro messages shown as the user keeps trying
  noButtonAttemptsMessages: [
    'hehe 😌',
    '',
    "you're really committed huh?",
    '',
    'just click YES already 😂',
    '',
    '',
    'okay this is getting embarrassing 😭',
    '',
    'fine... you win. YES is right there ❤️'
  ],
  datePhrases: ['oooh, that day 👀', 'perfect choice ❤️', 'noted ✍️', "that's a date!", 'locked in 🔒'],
  timePhrases: ['Okay, I\'ll remember that 👀', 'That works — noted ❤️'],
  postDateMessages: ['Finally, we have a plan 😌', 'Calendar officially booked ❤️', 'Okay, now it\'s getting real 👀', 'Adding this to my very important calendar.'],
  vibes: [
    { id: 'pizza', label: 'Pizza', emoji: '🍕', note: 'cheesy & cozy', reaction: 'excellent choice. cheesy decisions only 🍕' },
    { id: 'sushi', label: 'Sushi', emoji: '🍣', note: 'little bites', reaction: 'fancy. I respect it 🍣' },
    { id: 'burger', label: 'Burger', emoji: '🍔', note: 'messy in a good way', reaction: 'messy but worth it 🍔' },
    { id: 'pasta', label: 'Pasta', emoji: '🍝', note: 'twirl-worthy', reaction: 'okay, romantic already 🍝' },
    { id: 'tacos', label: 'Tacos', emoji: '🌮', note: 'a tiny fiesta', reaction: 'chaotic choice. I like it 🌮' },
    { id: 'salad', label: 'Salad', emoji: '🥗', note: 'fresh & lovely', reaction: 'someone is being responsible 🥗' },
  ] satisfies Vibe[],
}

export type InvitationConfig = typeof invitationConfig
