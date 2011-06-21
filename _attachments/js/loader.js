function loadScript(scripts) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>')
  };
};

loadScript([
  "js/jquery-1.4.2.min.js",
  "js/couchdb/sha1.js",
  "js/couchdb/json2.js",
  "js/couchdb/jquery.couch.js",
  "js/sammy/sammy-latest.min.js",
  "js/sammy/sammy.mustache-latest.min.js",
  "js/sammy/sammy.title-latest.min.js",
  "js/sammy/sammy.googleanalytics-latest.min.js",
  "js/fancybox/jquery.fancybox-1.3.4.pack.js",
  "js/tinymce/tiny_mce.js",
  "http://www.google.com/jsapi"
]);
