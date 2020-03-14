class Config {
  constructor() {

  }
  static version = function () {
    console.log('envVersion', __wxConfig.envVersion);
    let version = __wxConfig.envVersion;
    switch (version) {
      case 'develop':
        return 'https://shr.yfway.com';
        break;
      case 'trial':
        return 'https://shr.yfway.com';
        break;
      case 'release':
        return 'https://shr.yfway.com';
        break;
      default:
        return 'https://shr.yfway.com';
    }
  };

  static baseMain = Config.version();



  // api
  static Index = Config.baseMain + '/index.php?s=/GuideAssistant/' + 'Index/'
}
export {
  Config
}