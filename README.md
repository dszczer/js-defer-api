# JS Defer API
Ultralight defer script loader for JavaScript.

## What exactly is this?
This simple tricky API helps to defer script *in specified order* to load after HTML DOM is loaded. I have idea about `async` and `defer` **script** tags, but not all browsers support them. This API works fine on almost every browser.

## How to use it?
API contains 3 very simple global functions: DeferReady, DeferRenderScriptSequence and DeferRenderScriptTag. Simply place minified version of API in the `<head>` tag of HTML document.
```HTML
<script type="text/javascript">
  // ... minified API
</script>
```
Then load some scripts with *DeferRenderScriptTag

### DeferReady
This function accepts argument to call when defer API will launch. It helps to load bunch of scripts of functionalities that are not necessary to be parsed during loading of DOM.

### DeferRendrScriptSequence
This function accept first argument as array of web relative script paths to load, in order of course. Greates thing about this loader is fact, that next script will not load until the one before do. This makes defer loading dependencies very easy to implement.
Argument can also accept functions to call, instead of loading external scripts (if you need to execute some JavaScript between script loading).

### DeferRenderScriptTag
This simple function attach script tag to the DOM of document with specified `src` path, and optional `onload` second argument, what should be function to call after script is loaded.



## Examples

### Loading social scripts
Let's take Facebook for example. You will load their SDK like this [source](https://developers.facebook.com/docs/javascript/quickstart):
```html
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : 'your-app-id',
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>
```
With API you will simply wrap whole code within `DeferReady` function:
```html
<!-- assuming you're loaded API inside head tag -->
<script type="text/javascript">
  DeferReady(function () {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : 'your-app-id',
        xfbml      : true,
        version    : 'v2.8'
      });
      FB.AppEvents.logPageView();
    };
    
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  });
</script>
```
You can place this piece of defered code anywhere inside `<body`> tag, but placing this at the end of `<body>` tag is recommended.

### More to be documented...
