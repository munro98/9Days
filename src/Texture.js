
var textureMap = new Map();

class Texture {
    constructor (path) {
      this.path = path;

      if (textureMap[path] == null) {
        this.image = new Image();
        this.image.src = path
      } else {
        this.image = textureMap[path];
      }
    }
}