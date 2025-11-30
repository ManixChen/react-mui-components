declare module 'quill-emoji' {
  export interface EmojiBlot {
    // Emoji blot definition
  }
  
  export interface EmojiToolbar {
    // Emoji toolbar definition
  }
  
  export interface EmojiTextarea {
    // Emoji textarea definition
  }
  
  export interface EmojiShortname {
    // Emoji shortname definition
  }
  
  const quillEmoji: {
    emojiBlot?: any;
    toolbar?: any;
    textarea?: any;
    shortname?: any;
    default?: any;
  };
  
  export default quillEmoji;
}

