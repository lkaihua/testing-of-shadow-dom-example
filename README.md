# testing-of-shadow-dom-example
How to test a Shadow DOM based web app with Webdriver IO.

## About

This demo demonstrates how to set up a test against a minimum Shadow DOM based web app by extending webdriver IO native APIs.
We conclude following solution with hands-on experiences in testing of mission-critical web apps.

## Pain Point

![](https://web-components-resources.appspot.com/img/stories/shadowdom-architecture.png)

Since Shadow DOM creates a _sandbox_ to provide encapsulation, the traditional approach `document.getElementById` / `document.getElementsByClassName` is not able to retrieve any element within an Shadow DOM. 

On the other hand, it is legal to have multiple elements of the same `ID` within multiple instances of one component, making it even harder to retrieve elements.

Until August 2018 testing for Shadow DOM is not officially supported by Webdriver IO, however, `v5` Webdriver IO has opened an issue for [native support for shadow DOM](https://github.com/webdriverio/v5/issues/44).

## Technology stack

### Shadow DOM

Please note that according to Shadow DOM v1 spec, shadow roots can be closed. For closed roots, walking down the tree using the shadowRoot property isn't going to work. Make sure that you are turning `ShadowRoot.mode` in `OPEN` mode:

```javascript
let $element = document.createElement("div");
$element.attachShadow({ mode: "open" });
```

### Webdriver IO

WebDriver bindings for Node.js

> It basically sends requests to a Selenium server via the WebDriver Protocol and handles its response. These| requests are wrapped in useful commands and can be used to test several aspects of your site in an automated way.

### Selenium

### Cucumber

### Chai


## Steps

### Add a customized command to Wdio

We improved the command from the [original solution](https://gist.github.com/ChadKillingsworth/d4cb3d30b9d7fbc3fd0af93c2a133a53) by searching both inside and outside the Shadow tree. Also in practise we found that it brings in convenience with support for syntax of array index, when composing the path.

```javascript
/**
 * @param {string|Array<string>} selectors
 * @return {?Element}
 */
function findInShadowDom(selectors) {
  // pseudo code of primary logic
  root = document
  for selector in selectors:
    element = root.query(selector) 
    if element not found and root has a Shadow Root:
      element = root.shadowRoot.query(selector)
    root = element
  return element
}
```

This function will be exposed as a new Wdio command as `browser.$s`,

```javascript
browser.addCommand('$s', function (selectors) {
  return this.execute(findInShadowDom, selectors);
});
```

which will be the foundation of following solution.

### Use a common library

`utils.helpers.Common.js` offers a `Common` class to locate and manipulate Shadow DOM elements including:

```
Object.getOwnPropertyNames(Common.prototype)

[ 'constructor',  // constructor
  '_s',           // private method
  'get',
  'set',
  'isDisabled',
  'isVisible',
  'waitForShadowDomReady',
  'click',
  'scrollAndClick',
  'waitUntil' ]
```
### Compose a component test module

For example, we are going to write testcases against a new `demo-select` component with Shadow DOM enabled.

#### First create `utils/helpers/DemoSelect.js`
#### Second init module with Common
```javascript
const { Common } = require('./Common');
class DemoSelect {
  constructor(browser) {
    this.browser = browser;
    this.common = new Common(this.browser);
  }
}
exports.DemoSelect = DemoSelect;
```
#### Third add fields/methods.

This depends on the implementation of the components. 
Principal is __favor `public methods` over `DOM structure`__.

```javascript
 
  selectCss (selector) {
    return [...selector, "demo-container", "demo-select"];
  }

  get(selector) {
    const path = this.selectCss(selector);
    const value = this.common.get(path);
  }

  set(selector, value) {
    const path = this.selectCss(selector);
    return this.common.set(path, value);
  }

```

`selectCss` method states the inner structure of the component. The best practise here is __NOT__ to describe the structure of component, since it is fragile and often will require additional decoupling when the structure of the component updated. Instead, use public API of the component. 

```javascript
  get (selector) {
    return this.browser.$s(selector).selectedValue();
  }
  set (selector, value) {
    this.browser.$s(selector).selectByValue(value);
  }
```

This will bring long-term benifits if you are not fully in control of the components, and we strongly encourage you to make an agreement with component-makers that public interface will not introduce break-through changes without notifications. In most of times, as developers we are merely consumers of encapsulated components, and we would like to keep stable green tests.


### Compose a Wdio configuration

`wdio.conf.js` contains Webdriver IO configuration options along with comments. Normally we will keep common settings here, and extend it by merging into a new standalone file.
For example, `wdio.e2e.conf.js` will overwrite with options only applied to end-to-end test, such as mock server, and starting selenium in a local port.

Usually we will have:

| name | usage |
| -------------| ------------- |
| wdio.conf.js | base settings|
| wdio.e2e.conf.js | End-to-end test configurations, for local development |
| wdio.e2e.remote.conf.js | remote end-to-end test, outputs test results to continuous integration |
| wdio.integration.conf.js | integration test, involves data setup / backend service, etc. |
| wdio.production.conf.js | production monitoring |


#### specs

Test specs to run.

#### services

Wdio offers hooks before/after each stage for plugins to do extra things. These plugins can be installed as dev dependencies (in `package.json`) and defined in property `services`.

`package.json`:
```json
{
  "devDependencies": {
    "wdio-selenium-standalone-service": "~0.1"
  }
}
```

`wdio.conf.js`
```json
{
  services: ['selenium-standalone']
}
```


### Write features

`e2e/features` contains examples of `feature` files.

### Write step definitions.

`e2e/steps` contains examples of step definitons.

### Run e2e test

Pick up your most familiar tools to start running tests. Usually we will define `npm run e2e` as the command to run wdio binary and pass configuration file path to it.

```
npm run e2e
```

`package.json`
```
{
  "script" : ""
}
```

### Abstract logics into groups

Usually we will abstract logics into two levels: `component` and `page`.

- component: describe logics frequently used between a number of components. Group them into `e2e/components` folder.

- page: page level objects that can be reused. Group them into `e2e/pages` folder.


## Debug

To enable debug mode, please first set `debug=false` flag to `true` in `e2e/setup.js`.

Then add a `browser.debug()` to create a break point.

Switch headless browser into a normal browser if applicable.

Terminal will pause at that point, and you can start debugging by examing the css path of elements.

## Advanced

### Extend common library

Before getting hands dirty, let's walk through how Webdriver IO handles commands. It is of high importance to understand this flow according to my experience as an evangelist on automation testing.


### Hooks

Webdriver IO provides hooks during each stage. 

## Must Read

- https://www.webcomponents.org/community/articles/introduction-to-shadow-dom

- https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM

- https://gist.github.com/ChadKillingsworth/d4cb3d30b9d7fbc3fd0af93c2a133a53




