export default class utils  {


    static testFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
      }

}