var db = $.couch.db("akayu");
google.load("feeds", "1");

var app = Sammy('#colRight', function() {
  this.use('Mustache');
  this.use('Title');
  this.use('GoogleAnalytics');

  this.setTitle('Akayu Tecnologia');

  var userCtx = {};

  this.helpers({
    menuActive: function(menu) {
      $("#menu li").removeClass("active");
      $("#menu li." + menu).addClass("active");
      var title = $("#menu li.active a").html();
      this.titleCurrent(title);
    },
    titleCurrent: function(title) {
      if (title) {
        this.title(" - " + title);
        $("#page-title").html(title).show();
      } else {
        this.title();
        $("#page-title").hide();
      }
    }
  });

  this.around(function(callback) {
    $.couch.session({success: function(resp) {
      if (resp.userCtx.name != null) userCtx = resp.userCtx;
      callback();
    }});
  });

  this.before(function(ctx) {
    ctx.menuActive();
    ctx.titleCurrent();
    if (userCtx.name) ctx.user = userCtx;
    ctx.render('templates/user.mustache').replace("#user");
  });

  this.after(function(ctx) {
    $("#colRight").delegate(".editable", "click", function() {
      $.fancybox('<textarea style="width: 600px; height: 200px">'+$(this).html()+'</textarea><br><button>Edit</button>');
      tinyMCE.init({mode : "textareas", theme : "advanced",
        theme_advanced_buttons1 : "bold,italic,underline,|,justifyleft,justifycenter,justifyright,formatselect,fontsizeselect,|,bullist,numlist,|,blockquote,|,link,unlink,cleanup,code,|,forecolor,backcolor",
        theme_advanced_buttons2 : "",
        theme_advanced_buttons3 : "",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left"
      });
    });
  });

  this.get('/', function(ctx) {
    ctx.redirect('/projects');
  });

  this.get('/login', function(ctx) {
    ctx.titleCurrent('Login');
    ctx.partial('templates/login.mustache');
  });

  this.post('/login', function(ctx) {
    $.couch.login({name: ctx.params.user, password: ctx.params.password, success: function(resp) {
      ctx.redirect("/account");
    }, error: function() {
      ctx.redirect("/account");
    }});
  });

  this.get('/logout', function(ctx) {
    $.couch.logout({success: function(resp) {
      userCtx = {};
      ctx.redirect("/account");
    }});
  });

  this.get('/account', function(ctx) {
    $.couch.session({success: function(resp) {
      if (resp.userCtx.name != null) {
        ctx.titleCurrent('Minha área');

        ctx.partial('templates/account.mustache');
      } else { ctx.redirect("/login"); }
    }});
  });

  this.get('/home', function(ctx) {
    ctx.partial('templates/home.mustache');
  });

  this.get('/partners', function(ctx) {
    ctx.menuActive('partners');

    ctx.content = "Sem conteúdo";

    ctx.partial('templates/page.mustache');
  });

  this.get('/projects', function(ctx) {
    ctx.menuActive('projects');

    $.getJSON("http://github.com/api/v2/json/repos/show/henriquegogo?callback=?", function(json) {
      ctx.projects = json.repositories.reverse();
      ctx.partial('templates/projects.mustache');
    });
  });

  this.get('/events', function(ctx) {
    ctx.menuActive('events');

    var feeds = new google.feeds.Feed('http://www.google.com/calendar/feeds/akayu.com.br_8r5ujs48g7bboeq3lovipnpg28@group.calendar.google.com/public/full');
    feeds.load(function(result) {
      ctx.events = result.feed.entries.reverse();

      ctx.partial('templates/events.mustache');
    });
  });

  this.get('/blog', function(ctx) {
    ctx.menuActive('blog');

    ctx.title = "Sem conteúdo";
    ctx.content = "Sem conteúdo";

    ctx.partial('templates/article.mustache');
  });
});

$(document).ready(function() {
  app.run('/');

  $('html *').ajaxStart(function() {
    $(this).css('cursor', 'wait');
  }).ajaxStop(function() {
    $(this).css('cursor', 'auto');
  });
});
