export const themes = {
  monokai: {
    primaryColor: '#272822',
    textColor: '#F8F8F2',
    accentColor: '#66D9EF',
    folderColor: '#A6E22E',
    fileColor: '#F8F8F2',
    buttonBg: '#49483E',
    buttonText: '#F8F8F2',
    buttonHover: '#75715E',
  },
  dracula: {
    primaryColor: '#282A36',
    textColor: '#F8F8F2',
    accentColor: '#BD93F9',
    folderColor: '#50FA7B',
    fileColor: '#F8F8F2',
    buttonBg: '#44475A',
    buttonText: '#F8F8F2',
    buttonHover: '#6272A4',
  },
  solarized: {
    primaryColor: '#002B36',
    textColor: '#839496',
    accentColor: '#B58900',
    folderColor: '#2AA198',
    fileColor: '#839496',
    buttonBg: '#073642',
    buttonText: '#EEE8D5',
    buttonHover: '#586E75',
  },
};

export type ThemeName = keyof typeof themes;